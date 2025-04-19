import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CoreGateway, PrismaService } from './core.gateway';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private gtw: CoreGateway,
    private readonly prisma: PrismaService,
  ) {}
  async onApplicationBootstrap() {
    // ESEMPIO DI PUBBLICAZIONE EVENTO
    // setInterval(() => {
    //   this.gtw.publishEvent('test.event', { prop1: 'Hello from AppService', prop2: Math.random() });
    // }, 5000);
    // setInterval(async () => {
    //   try {
    //     const sessionsCount = this.gtw.Sessions.size;
    //     if (sessionsCount === 0) return;
    //     const rndSession = Array.from(this.gtw.Sessions.values())[Math.trunc(Math.random() * sessionsCount)];
    //     const clientId = rndSession.clientId;
    //     const rv = await this.gtw.requestToClient(clientId, 'TestService.clientMethodAsync', { ts: `${new Date().getTime()}`, sessionsCount });
    //     console.log('rv', rv);
    //   } catch (err) {
    //     console.error(err.message);
    //   }
    // }, 5000);
    // setInterval(async () => {
    //   try {
    //     const rv = await this.prisma.client.findMany({
    //       where: {
    //         sessions: {
    //           gt: 0,
    //         },
    //       },
    //     });
    //     console.log('clients online:', rv.length);
    //   } catch (err) {
    //     console.error(err.message);
    //   }
    // }, 10000);
  }
}
