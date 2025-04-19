import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit(): Promise<void>;
}
export declare class CoreGateway implements OnApplicationBootstrap {
    private readonly prisma;
    private readonly eventEmitter;
    private jwtService;
    private server;
    Sessions: Map<string, ISocketSession>;
    private ServicesMap;
    private sysUsr;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2, jwtService: JwtService);
    onApplicationBootstrap(): Promise<void>;
    register(serviceName: string, service: BaseService, requiresAuth?: boolean): void;
    private handleConnection;
    private handleDisconnect;
    requestToClient<RQ, RS>(clientId: string, topic: string, payload: RQ, excludeSocketIds?: string[], timeout?: number): Promise<IResponse<RS>[]>;
    private handleLogin;
    private login;
    private logout;
    private refresh;
    private handleRequest;
    private handleMessage;
    private handlePrismaRequest;
    private _prismaHnd;
    prismaHnd<T>(entityName: string, methodName: string, param: any): Promise<T>;
    byUser(method: string, arg: any, user?: User): void;
    private handleSubscription;
    private handleAllEvents;
    publishEvent<T>(name: string, payload: T): void;
}
