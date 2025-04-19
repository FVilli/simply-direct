import { EventType, MsgType } from '@common/enums';
import { ISocketSession } from '@common/interfaces';

export type Message<T> = {
  topic: string;
  payload: T;
  _type?: MsgType;
  _id?: string;
  _dest?: string[];
  _sender?: string;
  _rqst?: Message<any>;
};
export type Request<RQ, RS> = {
  source: Message<RQ>;
  sendResponse: (response: Message<RS>, source: Request<RQ, RS>) => void;
};
export type Event = { _type: EventType; info?: any; session: ISocketSession };

// export type Message<T> = { topic: string, payload: T, _type?: MsgType, _id?: string, _dest?: string, _sender?: string, _rqst?: Message<any> }
export type Response<T> = { data: T; err?: string };
// export type Event = { _type: EventType; info?: any; }
// export enum EventType { connect = "connect", disconnect = "disconnect", server = "server" }
// export enum MsgType { msg = "msg", rqst = "rqst", rsp = "rsp", evt = "evt" }
