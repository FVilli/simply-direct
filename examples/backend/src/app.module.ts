import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppService } from './app.service';
import { CoreGateway, PrismaService } from './core.gateway';
import { UtilsService } from './utils.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { MessagingModule } from './features/messaging/messaging.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      newListener: true,
      removeListener: true,
      maxListeners: 10, // the maximum amount of listeners that can be assigned to an event
      verboseMemoryLeak: true, // show event name in memory leak message when more than maximum amount of listeners is assigned
      ignoreErrors: false, // disable throwing uncaughtException if an error event is emitted and it has no listeners
    }),
    MessagingModule,
  ],
  controllers: [],
  providers: [CoreGateway, PrismaService, AppService, UtilsService, JwtService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private gtw: CoreGateway,
    private utils: UtilsService,
  ) {}
  async onApplicationBootstrap() {
    this.gtw.register(this.utils.serviceName, this.utils, false);
  }
}
