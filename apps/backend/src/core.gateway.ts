/* eslint-disable prettier/prettier */ // perchè fa come gli pare ed è impossibile personalizzare la configurazione, perchè essenzialmente non si sa dove è ... è nel progetto ? è in vscode ? ... questo è il problema
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { enhance } from '@zenstackhq/runtime';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { QUID } from './utils.functions';
import { ENV } from './env';
import { Message } from '@common/types';
import { hash } from './utils.functions';
import { ISocketSession, IEvent, IAuth, ILoginMsg, ILogoutMsg, IRefreshMsg, IJwtPayload, IResponse } from '@common/interfaces';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { BaseService } from '@common/classes';
import { distinctSubscriptions, isMatching, ITdt } from '@common/functions';

@Injectable() export class PrismaService extends PrismaClient implements OnModuleInit { async onModuleInit() { await this.$connect(); } }

@WebSocketGateway({ cors: true, pingInterval: 1000, pingTimeout: 1000 })
export class CoreGateway implements OnApplicationBootstrap {
  @WebSocketServer() private server: Server;
  Sessions = new Map<string, ISocketSession>();
  private ServicesMap = new Map<string, { service: BaseService; requiresAuth: boolean }>();
  private sysUsr:User;
  constructor(private readonly prisma: PrismaService, private readonly eventEmitter: EventEmitter2, private jwtService: JwtService) {
    
  }
  async onApplicationBootstrap() {
    // serve perchè quando stoppo il backend potrei non fare in tempo a gestire bene tutte le disconnessioni
    // che riporterebbero comunque sessions a 0
    await this.prisma.client.updateMany({ data: { sessions: 0 } });
    this.sysUsr = await this.prisma.user.findFirst({ where: { name: 'system' } }) || await this.prisma.user.create({ data: { name: 'system', phash: '', disabled: false, role:'SYSTEM' } });
  }

  register(serviceName: string, service: BaseService, requiresAuth = true) {
    this.ServicesMap.set(serviceName, { service, requiresAuth });
    console.log(`${ITdt()} <CORE> Registered service:`, serviceName);
  }

  private async handleConnection(socket: Socket) {
    const clientId = <string>socket.client.request.headers['client-id'];
    const userAgent = socket.client.request.headers['user-agent'];
    console.log(`${ITdt()} <CORE> [connected] socket.id:`, socket.id, 'clientId:', clientId);
    this.Sessions.set(socket.id, { socket: socket, clientId, subscriptions: [] });
    await this.prisma.client.upsert({
      where: { name: clientId },
      update: { agent: userAgent, sessions: { increment: 1 }, updated_at: new Date() },
      create: { name: clientId, agent: userAgent, sessions: 1 },
    });
  }

  private async handleDisconnect(socket: Socket) {
    const clientId = this.Sessions.get(socket.id).clientId;
    console.log(`${ITdt()} <CORE> [disconnected] socket.id:`, socket.id, 'clientId:', clientId);
    this.Sessions.delete(socket.id);
    await this.prisma.client.update({
      where: { name: clientId },
      data: { sessions: { decrement: 1 }, updated_at: new Date() },
    });
  }

  // ================================================================================================
  // SEND REQUEST TO CLIENT (un client può avere più tab aperti quindi più sessioni)
  // ================================================================================================

  // i messaggi ai client vengono mandati tramite la modalità evento/sottoscrizione
  // le richieste invece tramite il concetto di handler registrato nel client
  // (con la possible eccezione nessun handler registrato)
  // in caso di hadler registrato arrivarà una risposta al server
  public requestToClient<RQ, RS>(clientId: string, topic: string, payload: RQ, excludeSocketIds: string[] = [], timeout = 10): Promise<IResponse<RS>[]> {
    return new Promise<IResponse<RS>[]>((resolve, reject) => {
      try {
        setTimeout(() => reject({ message: 'timeout' }), timeout * 1000);

        const responses: IResponse<RS>[] = [];
        const sessions = Array.from(this.Sessions.values()).filter(s => (s.clientId === clientId || clientId === '**') && !excludeSocketIds.includes(s.socket.id));
        if (sessions.length === 0) resolve([]);
        sessions.forEach(session => {
          console.log('request', session.clientId, topic);
          session.socket.emit('request', { topic, payload }, (rv: IResponse<RS>) => {
            //console.log('response', session.clientId, rv);
            responses.push(rv);
            if (responses.length === sessions.length) resolve(responses);
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // ================================================================================================
  // AUTHENTICATION
  // ================================================================================================
  @SubscribeMessage('auth')
  private async handleLogin(@MessageBody() msg: Message<any>, @ConnectedSocket() socket: Socket):Promise<IResponse<IAuth>> {
    console.log(`${ITdt()} <CORE> [auth] socket.id:${socket.id} msg:`, msg.topic);
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
    } catch (err) {
      console.error('err:', err.message);
      return { err: err.message };
    }
  }

  private async login(payload: ILoginMsg, clientId: string): Promise<IAuth | null> {
    const phash = hash(payload.password);
    const name = payload.username;
    const user = await this.prisma.user.findFirst({ where: { name, phash } });
    if (!!user && !user.disabled) {
      const token = this.jwtService.sign({ username: name, sub: user.id, clientId }, { expiresIn: ENV.JWT_EXPIRES_IN, secret: ENV.JWT_SECRET });
      await this.prisma.client.update({
        where: { name: payload.clientId },
        data: { token, user_id: user.id, updated_at: new Date() },
      });
      delete user.phash;
      return { user, token };
    } else {
      await this.prisma.client.update({
        where: { name: payload.clientId },
        data: { user_id: null, updated_at: new Date() },
      });
      return null;
    }
  }
  private async logout(payload: ILogoutMsg, cs: ISocketSession): Promise<void> {
    if (cs.clientId !== payload.clientId) console.error('Anomalous logout');
    await this.prisma.client.update({
      where: { name: payload.clientId },
      data: { token: null, user_id: null, updated_at: new Date() },
    });
  }
  private async refresh(payload: IRefreshMsg, clientId: string): Promise<IAuth> {
    try {
      const tokenPayload = this.jwtService.verify<IJwtPayload>(payload.token, { secret: ENV.JWT_SECRET });
      if (clientId !== tokenPayload.clientId) console.error('Anomalous refresh');
      const user = await this.prisma.user.findFirst({ where: { id: tokenPayload.sub } });
      if (user.disabled) throw new Error('User disabled');
      const client = await this.prisma.client.findFirst({ where: { name: clientId } });
      if (!client || client.token !== payload.token) throw new Error('Token revoked');
      const token = this.jwtService.sign({ username: user.name, sub: user.id, clientId }, { expiresIn: ENV.JWT_EXPIRES_IN, secret: ENV.JWT_SECRET });
      await this.prisma.client.update({
        where: { name: payload.clientId },
        data: { token, user_id: user.id, updated_at: new Date() },
      });
      delete user.phash;
      return { user, token };
    } catch (err) {
      console.error(err.message);
      await this.prisma.client.update({
        where: { name: payload.clientId },
        data: { token: null, user_id: null, updated_at: new Date() },
      });
      return null;
    }
  }

  // ================================================================================================
  // REQUEST TO REGISTERED SERVICE
  // ================================================================================================
  @SubscribeMessage('request')
  private async handleRequest<T>(@MessageBody() msg: Message<any>, @ConnectedSocket() socket: Socket): Promise<IResponse<T>> {
    console.log(`${ITdt()} <CORE> [request] socket.id:${socket.id} msg:`, msg);
    try {
      const serviceName = msg.topic.split('.')[0];
      const methodName = msg.topic.split('.')[1];
      const auth = this.Sessions.get(socket.id).auth;
      const service = this.ServicesMap.get(serviceName).service;
      const requiresAuth = this.ServicesMap.get(serviceName).requiresAuth;
      if (requiresAuth && !auth && !ENV.SKIP_AUTH) throw new Error('Unauthorized');
      return { data: await service[methodName](msg.payload, auth) };
    } catch (err) {
      console.error('err:', err.message);
      return { err: err.message };
    }
  }

  // ================================================================================================
  // MESSAGE TO REGISTERED SERVICE
  // ================================================================================================
  @SubscribeMessage('message')
  private async handleMessage(@MessageBody() msg: Message<any>, @ConnectedSocket() socket: Socket): Promise<IResponse<string>> {
    //console.log(`<CORE> [message] socket.id:${socket.id} msg:`, msg);
    try {
      const serviceName = msg.topic.split('.')[0];
      const methodName = msg.topic.split('.')[1];
      const auth = this.Sessions.get(socket.id).auth;
      const service = await this.ServicesMap.get(serviceName).service;
      const requiresAuth = this.ServicesMap.get(serviceName).requiresAuth;
      if (requiresAuth && !auth && !ENV.SKIP_AUTH) throw new Error('Unauthorized');
      setImmediate(async () => {
        const st = new Date();
        await service[methodName](msg.payload, auth);
        const ms = new Date().getTime() - st.getTime();
        console.log(`${ITdt()} <CORE> [executed] ${msg.topic} requested by ${auth?.user.id} in ${ms} ms`);
      });
      return { status: 'OK' };
    } catch (err) {
      console.error('err:', err.message);
      return { err: err.message };
    }
  }

  // ================================================================================================
  // REQUEST TO PRISMA CLIENT (ENHANCED BY ZENSTACK)
  // ================================================================================================
  @SubscribeMessage('prisma')
  private async handlePrismaRequest<T>(@MessageBody() msg: Message<any>, @ConnectedSocket() socket: Socket): Promise<IResponse<T>> {
    console.log(`${ITdt()} <CORE> [prisma] socket.id:${socket.id} msg:`, msg);
    try {
      const entityName = msg.topic.split('.')[0];
      const methodName = msg.topic.split('.')[1];
      const auth = this.Sessions.get(socket.id).auth;
      if (!auth && !ENV.SKIP_AUTH) throw new Error('Unauthorized');
      if((ENV.NOT_ALLOWED_PRISMA_METHODS).includes(methodName)) throw new Error('Method not allowed');
      const data = await this._prismaHnd<T>(entityName, methodName, msg.payload, auth?.user);
      return { data };
    } catch (err) {
      console.error('err:', err.message);
      return { err: err.message };
    }
  }

  private async _prismaHnd<T>(entityName: string, methodName: string, param: any, user: User):Promise<T> {
    const prismaEnhanced = enhance(this.prisma, { user });
    this.publishEvent(`prisma.${entityName}.${methodName}.${param?.id || param?.where?.id || param?.data?.id ||'?'}.before`, param);
    this.byUser(methodName,param,user);
    const rv:any = await prismaEnhanced[entityName][methodName](param);
    this.publishEvent(`prisma.${entityName}.${methodName}.${rv?.id || '?'}.after`, rv);
    return rv as T;
  }

  public async prismaHnd<T>(entityName: string, methodName: string, param: any):Promise<T> {
    return await this._prismaHnd<T>(entityName, methodName, param, this.sysUsr);
  }

  // updated_at & created_at li gestisce zenstack & postgres
  // per ora la cancellazione, che sarà logica, non è gestita
  byUser(method:string, arg:any, user?:User) {
    if(!user?.id) return;
    switch (method) {
      case 'create':
          if(!!arg.data) arg.data.created_by = user.id;
        break;
      case 'createMany':
        if(Array.isArray(arg.data)) (<any[]>arg.data).every(d => d.created_by = user.id);
        break;
      case 'update':
      case 'updateMany':
        if(!!arg.data) arg.data.updated_by = user.id;
        break;
      case 'upsert':
        if(!!arg.update) arg.update.updated_by = user.id;
        if(!!arg.create) arg.create.created_by = user.id;
        break;
    }
  }

  // ================================================================================================
  // EVENTS
  // ================================================================================================
  @SubscribeMessage('subscriptions')
  private async handleSubscription(@MessageBody() msg: Message<any>, @ConnectedSocket() socket: Socket) {
    console.log(`${ITdt()} <CORE> [subscriptions] socket.id:${socket.id} msg:`, msg);
    try {
      const session = this.Sessions.get(socket.id);
      if (!session.auth && !ENV.SKIP_AUTH) throw new Error('Unauthorized');
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
    } catch (err) {
      console.error(`${ITdt()} <CORE> err:`, err.message);
      return { error: err.message };
    }
  }

  @OnEvent('**')
  private handleAllEvents<T>(event: IEvent<T>) {
    for (const session of this.Sessions.values()) {
      if (isMatching(event.name, distinctSubscriptions(session.subscriptions))) {
        session.socket.emit('event', event, (rv: IResponse<any>) => {
          console.log(`${ITdt()} <CORE> event`, event.name, 'dispatched to:', session.clientId, 'rv:', rv);
        });
      }
    }
  }

  public publishEvent<T>(name: string, payload: T) {
    const event: IEvent<T> = { name, payload, ts: new Date(), id: QUID() };
    console.log(`${ITdt()} <CORE> publishing event:`, event.name);
    this.eventEmitter.emit(name, event);
  }
}
