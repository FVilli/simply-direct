import { EventType, MsgType } from './enums';
import { ISocketSession } from './interfaces';

export type User = {
  name: string;
  id: number;
  uid: string | null;
  owned_by: number | null;
  created_at: Date;
  created_by: number | null;
  updated_at: Date
  updated_by: number | null
  deleted_at: Date | null
  deleted_by: number | null
  email: string | null
  phash: string | null
  role: string | null
  disabled: boolean;
  [key: string]: any;
}

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
