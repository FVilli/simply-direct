import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { WebpushService } from './webpush.service';
import { MessagingService } from './messaging.service';

/**
 * Calcola la somma di due numeri.
 * 
 * @param a - Il primo numero
 * @param b - Il secondo numero
 * @returns La somma di `a` e `b`
 *
 * @example
 * ```ts
 * const result = sum(2, 3);
 * console.log(result); // 5
 * ```
 */
@Module({
  providers: [MessagingService, MailService, WebpushService],
  exports: [MailService, WebpushService],
})
export class MessagingModule {}
