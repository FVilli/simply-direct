"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreGateway = exports.PrismaService = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const runtime_1 = require("@zenstackhq/runtime");
const event_emitter_1 = require("@nestjs/event-emitter");
const env_1 = require("./env");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
const utils_functions_1 = require("./utils.functions");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() { await this.$connect(); }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
let CoreGateway = class CoreGateway {
    constructor(prisma, eventEmitter, jwtService) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.jwtService = jwtService;
        this.Sessions = new Map();
        this.ServicesMap = new Map();
    }
    async onApplicationBootstrap() {
        await this.prisma.client.updateMany({ data: { sessions: 0 } });
        this.sysUsr = await this.prisma.user.findFirst({ where: { name: 'system' } }) || await this.prisma.user.create({ data: { name: 'system', phash: '', disabled: false, role: 'SYSTEM' } });
    }
    register(serviceName, service, requiresAuth = true) {
        this.ServicesMap.set(serviceName, { service, requiresAuth });
        console.log(`${(0, utils_functions_1.ITdt)()} <CORE> Registered service:`, serviceName);
    }
    async handleConnection(socket) {
        const clientId = socket.client.request.headers['client-id'];
        const userAgent = socket.client.request.headers['user-agent'];
        console.log(`${(0, utils_functions_1.ITdt)()} <CORE> [connected] socket.id:`, socket.id, 'clientId:', clientId);
        this.Sessions.set(socket.id, { socket: socket, clientId, subscriptions: [] });
        await this.prisma.client.upsert({
            where: { name: clientId },
            update: { agent: userAgent, sessions: { increment: 1 }, updated_at: new Date() },
            create: { name: clientId, agent: userAgent, sessions: 1 },
        });
    }
    async handleDisconnect(socket) {
        const clientId = this.Sessions.get(socket.id).clientId;
        console.log(`${(0, utils_functions_1.ITdt)()} <CORE> [disconnected] socket.id:`, socket.id, 'clientId:', clientId);
        this.Sessions.delete(socket.id);
        await this.prisma.client.update({
            where: { name: clientId },
            data: { sessions: { decrement: 1 }, updated_at: new Date() },
        });
    }
    requestToClient(clientId, topic, payload, excludeSocketIds = [], timeout = 10) {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => reject({ message: 'timeout' }), timeout * 1000);
                const responses = [];
                const sessions = Array.from(this.Sessions.values()).filter(s => (s.clientId === clientId || clientId === '**') && !excludeSocketIds.includes(s.socket.id));
                if (sessions.length === 0)
                    resolve([]);
                sessions.forEach(session => {
                    console.log('request', session.clientId, topic);
                    session.socket.emit('request', { topic, payload }, (rv) => {
                        responses.push(rv);
                        if (responses.length === sessions.length)
                            resolve(responses);
                    });
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async handleLogin(msg, socket) {
        console.log(`${(0, utils_functions_1.ITdt)()} <CORE> [auth] socket.id:${socket.id} msg:`, msg.topic);
        try {
            const session = this.Sessions.get(socket.id);
            switch (msg.topic) {
                case 'login':
                    session.auth = await this.login(msg.payload, session.clientId);
                    break;
                case 'logout':
                    await this.logout(msg.payload, session);
                    session.auth = null;
                    break;
                case 'refresh':
                    session.auth = await this.refresh(msg.payload, session.clientId);
                    break;
            }
            return { data: session.auth, status: !!session.auth ? 'OK' : 'NO-AUTH' };
        }
        catch (err) {
            console.error('err:', err.message);
            return { err: err.message };
        }
    }
    async login(payload, clientId) {
        const phash = (0, utils_functions_1.hash)(payload.password);
        const name = payload.username;
        const user = await this.prisma.user.findFirst({ where: { name, phash } });
        if (!!user && !user.disabled) {
            const token = this.jwtService.sign({ username: name, sub: user.id, clientId }, { expiresIn: env_1.ENV.JWT_EXPIRES_IN, secret: env_1.ENV.JWT_SECRET });
            await this.prisma.client.update({
                where: { name: payload.clientId },
                data: { token, user_id: user.id, updated_at: new Date() },
            });
            delete user.phash;
            return { user, token };
        }
        else {
            await this.prisma.client.update({
                where: { name: payload.clientId },
                data: { user_id: null, updated_at: new Date() },
            });
            return null;
        }
    }
    async logout(payload, cs) {
        if (cs.clientId !== payload.clientId)
            console.error('Anomalous logout');
        await this.prisma.client.update({
            where: { name: payload.clientId },
            data: { token: null, user_id: null, updated_at: new Date() },
        });
    }
    async refresh(payload, clientId) {
        try {
            const tokenPayload = this.jwtService.verify(payload.token, { secret: env_1.ENV.JWT_SECRET });
            if (clientId !== tokenPayload.clientId)
                console.error('Anomalous refresh');
            const user = await this.prisma.user.findFirst({ where: { id: tokenPayload.sub } });
            if (user.disabled)
                throw new Error('User disabled');
            const client = await this.prisma.client.findFirst({ where: { name: clientId } });
            if (!client || client.token !== payload.token)
                throw new Error('Token revoked');
            const token = this.jwtService.sign({ username: user.name, sub: user.id, clientId }, { expiresIn: env_1.ENV.JWT_EXPIRES_IN, secret: env_1.ENV.JWT_SECRET });
            await this.prisma.client.update({
                where: { name: payload.clientId },
                data: { token, user_id: user.id, updated_at: new Date() },
            });
            delete user.phash;
            return { user, token };
        }
        catch (err) {
            console.error(err.message);
            await this.prisma.client.update({
                where: { name: payload.clientId },
                data: { token: null, user_id: null, updated_at: new Date() },
            });
            return null;
        }
    }
    async handleRequest(msg, socket) {
        console.log(`${(0, utils_functions_1.ITdt)()} <CORE> [request] socket.id:${socket.id} msg:`, msg);
        try {
            const serviceName = msg.topic.split('.')[0];
            const methodName = msg.topic.split('.')[1];
            const auth = this.Sessions.get(socket.id).auth;
            const service = this.ServicesMap.get(serviceName).service;
            const requiresAuth = this.ServicesMap.get(serviceName).requiresAuth;
            if (requiresAuth && !auth && !env_1.ENV.SKIP_AUTH)
                throw new Error('Unauthorized');
            return { data: await service[methodName](msg.payload, auth) };
        }
        catch (err) {
            console.error('err:', err.message);
            return { err: err.message };
        }
    }
    async handleMessage(msg, socket) {
        try {
            const serviceName = msg.topic.split('.')[0];
            const methodName = msg.topic.split('.')[1];
            const auth = this.Sessions.get(socket.id).auth;
            const service = await this.ServicesMap.get(serviceName).service;
            const requiresAuth = this.ServicesMap.get(serviceName).requiresAuth;
            if (requiresAuth && !auth && !env_1.ENV.SKIP_AUTH)
                throw new Error('Unauthorized');
            setImmediate(async () => {
                const st = new Date();
                await service[methodName](msg.payload, auth);
                const ms = new Date().getTime() - st.getTime();
                console.log(`${(0, utils_functions_1.ITdt)()} <CORE> [executed] ${msg.topic} requested by ${auth === null || auth === void 0 ? void 0 : auth.user.id} in ${ms} ms`);
            });
            return { status: 'OK' };
        }
        catch (err) {
            console.error('err:', err.message);
            return { err: err.message };
        }
    }
    async handlePrismaRequest(msg, socket) {
        console.log(`${(0, utils_functions_1.ITdt)()} <CORE> [prisma] socket.id:${socket.id} msg:`, msg);
        try {
            const entityName = msg.topic.split('.')[0];
            const methodName = msg.topic.split('.')[1];
            const auth = this.Sessions.get(socket.id).auth;
            if (!auth && !env_1.ENV.SKIP_AUTH)
                throw new Error('Unauthorized');
            if ((env_1.ENV.NOT_ALLOWED_PRISMA_METHODS).includes(methodName))
                throw new Error('Method not allowed');
            const data = await this._prismaHnd(entityName, methodName, msg.payload, auth === null || auth === void 0 ? void 0 : auth.user);
            return { data };
        }
        catch (err) {
            console.error('err:', err.message);
            return { err: err.message };
        }
    }
    async _prismaHnd(entityName, methodName, param, user) {
        var _a, _b;
        const prismaEnhanced = (0, runtime_1.enhance)(this.prisma, { user });
        this.publishEvent(`prisma.${entityName}.${methodName}.${(param === null || param === void 0 ? void 0 : param.id) || ((_a = param === null || param === void 0 ? void 0 : param.where) === null || _a === void 0 ? void 0 : _a.id) || ((_b = param === null || param === void 0 ? void 0 : param.data) === null || _b === void 0 ? void 0 : _b.id) || '?'}.before`, param);
        this.byUser(methodName, param, user);
        const rv = await prismaEnhanced[entityName][methodName](param);
        this.publishEvent(`prisma.${entityName}.${methodName}.${(rv === null || rv === void 0 ? void 0 : rv.id) || '?'}.after`, rv);
        return rv;
    }
    async prismaHnd(entityName, methodName, param) {
        return await this._prismaHnd(entityName, methodName, param, this.sysUsr);
    }
    byUser(method, arg, user) {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return;
        switch (method) {
            case 'create':
                if (!!arg.data)
                    arg.data.created_by = user.id;
                break;
            case 'createMany':
                if (Array.isArray(arg.data))
                    arg.data.every(d => d.created_by = user.id);
                break;
            case 'update':
            case 'updateMany':
                if (!!arg.data)
                    arg.data.updated_by = user.id;
                break;
            case 'upsert':
                if (!!arg.update)
                    arg.update.updated_by = user.id;
                if (!!arg.create)
                    arg.create.created_by = user.id;
                break;
        }
    }
    async handleSubscription(msg, socket) {
        console.log(`${(0, utils_functions_1.ITdt)()} <CORE> [subscriptions] socket.id:${socket.id} msg:`, msg);
        try {
            const session = this.Sessions.get(socket.id);
            if (!session.auth && !env_1.ENV.SKIP_AUTH)
                throw new Error('Unauthorized');
            switch (msg.topic) {
                case 'clear':
                    session.subscriptions = {};
                    break;
                case 'add':
                    session.subscriptions[msg.payload.idx] = msg.payload.subscriptions;
                    break;
                case 'remove':
                    delete session.subscriptions[msg.payload.idx];
                    break;
                case 'get':
                    break;
            }
            return session.subscriptions;
        }
        catch (err) {
            console.error(`${(0, utils_functions_1.ITdt)()} <CORE> err:`, err.message);
            return { error: err.message };
        }
    }
    handleAllEvents(event) {
        for (const session of this.Sessions.values()) {
            if ((0, utils_functions_1.isMatching)(event.name, (0, utils_functions_1.distinctSubscriptions)(session.subscriptions))) {
                session.socket.emit('event', event, (rv) => {
                    console.log(`${(0, utils_functions_1.ITdt)()} <CORE> event`, event.name, 'dispatched to:', session.clientId, 'rv:', rv);
                });
            }
        }
    }
    publishEvent(name, payload) {
        const event = { name, payload, ts: new Date(), id: (0, utils_functions_1.QUID)() };
        console.log(`${(0, utils_functions_1.ITdt)()} <CORE> publishing event:`, event.name);
        this.eventEmitter.emit(name, event);
    }
};
exports.CoreGateway = CoreGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CoreGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('auth'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Message !== "undefined" && Message) === "function" ? _a : Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CoreGateway.prototype, "handleLogin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('request'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Message !== "undefined" && Message) === "function" ? _b : Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CoreGateway.prototype, "handleRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof Message !== "undefined" && Message) === "function" ? _c : Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CoreGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('prisma'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof Message !== "undefined" && Message) === "function" ? _d : Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CoreGateway.prototype, "handlePrismaRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscriptions'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof Message !== "undefined" && Message) === "function" ? _e : Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], CoreGateway.prototype, "handleSubscription", null);
__decorate([
    (0, event_emitter_1.OnEvent)('**'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof IEvent !== "undefined" && IEvent) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], CoreGateway.prototype, "handleAllEvents", null);
exports.CoreGateway = CoreGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true, pingInterval: 1000, pingTimeout: 1000 }),
    __metadata("design:paramtypes", [PrismaService, event_emitter_1.EventEmitter2, jwt_1.JwtService])
], CoreGateway);
//# sourceMappingURL=core.gateway.js.map