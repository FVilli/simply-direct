import { Injectable } from '@nestjs/common';
import { BaseService } from '@common/classes';
import { Message } from '@common/types';
import { IAuth } from '@common/interfaces';
import { User } from '@prisma/client';
import { delay } from '@common/functions';
import { hash } from './utils.functions';

@Injectable()
export class UtilsService extends BaseService {
  // async methodAsync(msg: Message<any>, auth: IAuth): Promise<User> {
  //   const rv: User = { id: 1, name: 'test', uid: 'test', email: 'test', phash: 'test', role: 'test', disabled: false, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
  //   await delay(1000);
  //   return rv;
  // }

  // methodSync(msg: Message<any>, auth: IAuth): number[] {
  //   return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // }

  // methodClientTime(msg: Message<any>, auth: IAuth): Date {
  //   return new Date();
  // }

  hash(text:string, auth: IAuth): string {
    return hash(text);
  }
}
