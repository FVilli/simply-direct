import { computed, effect, inject, Injectable, isDevMode, signal, WritableSignal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { IResponse, IAuth, ILoginMsg, ILogoutMsg, IRefreshMsg, IMessage, IEvent } from '@common/interfaces';
import { BaseService } from '@common/classes';
import { MsgType } from '@common/enums';
import { crossTabCounter, isMatching, ITdt } from '@common/functions'
import { CanActivateFn, Router } from '@angular/router';
import { CLIENT_ID, CLIENT_ID_KEY } from './main';
import { Subject } from 'rxjs';
import { signalStore, type } from '@ngrx/signals';
import { withLookupEntities } from './app/core/with-lookup-entities';
import { User } from '@prisma/client';

const _AUTH = '_AUTH';
const START_AUTH = localStorage.getItem(_AUTH) ? JSON.parse(localStorage.getItem(_AUTH)!) : null;

export function authGuard(): CanActivateFn {
  return () => {
    const router = inject(Router);
    const core = inject(CoreService);
    if (core.$loggedIn()) return true;
    router.navigate(['/']);
    return false;
  };
}


type CoreState = { inizialized:boolean; connected:boolean; };

// in questo store devo mettere:
// inizialized:boolean; 
// quando è inizializzato: 
//  A. se ha il token, dopo l'esito del refresh che avviene alla 1a connessione, 
//  B. se non ha il token alla 1a connessione
// connected:boolean;
// auth:IAuth;
// loggedIn:boolean; COMPUTED a auth
// users: è una specie di entità di base che non conviene avere sempre aggiornata:
// A. non sono loggato --> user: [] o null
// B. sono loggato: aggiornata e sottoscrivere agli aggiornamenti

export const CoreStore = signalStore(
  { providedIn: 'root' },
  withLookupEntities<User,'user'>({ entity: type<User>(), collection: 'user' }),
);

@Injectable({ providedIn: 'root' })
export class CoreService {
  readonly router = inject(Router);
  //readonly store = inject(CoreStore);
  private readonly broadcastChannel = new BroadcastChannel('AppService');
  private readonly address = isDevMode() ? window.location.hostname + ":3000" : window.location.origin;
  private socket!: Socket;
  // public messages$: Observable<Message<any>>;
  private _$events = signal(<IEvent<any>>{ name: 'app.start', ts: new Date() });
  $events = this._$events.asReadonly();
  //public $socketId:WritableSignal<string | undefined> = signal(undefined);
  private _$connected = signal(false);
  $connected = this._$connected.asReadonly();
  private _$sessionId:WritableSignal<string | undefined> = signal(undefined);
  $sessionId = this._$sessionId.asReadonly();
  private _$auth = signal<IAuth | undefined>(START_AUTH);
  $auth = this._$auth.asReadonly();
  $loggedIn = computed(()=>!!this._$auth());
  private servicesMap = new Map<string, { service: BaseService; requiresAuth: boolean }>();
  public readonly clientId = CLIENT_ID;
  constructor() {

    this.broadcastChannel.onmessage = (event) => {
      console.log(`${ITdt()} BroadcastChannel [AppService] Message:`, event.data);
      switch (event.data.topic) {
        case 'auth': 
          this.setAuth(event.data.payload,false); 
          if(!event.data.payload) this.router.navigate(['/']);
        break;
      }
    };

    setInterval(this.refresh.bind(this), 60*60*1000);
        
    effect(() => {
        const auth = this._$auth();
        auth ? localStorage.setItem(_AUTH, JSON.stringify(auth)) : localStorage.removeItem(_AUTH);
    });

    effect(()=>{
        const connected = this._$connected();
        console.log("SIO:CONNECTED",connected);
        if(connected) setTimeout(this.refresh.bind(this),100);
    })
    console.log(`${ITdt()} <CORE> [init] socket.io-client address:`,this.address);
    this.socket = io(this.address,{ extraHeaders: { 'client-id': CLIENT_ID }});

    this.socket.on('connect', () => { this._$connected.set(true); this._$sessionId.set(this.socket.id); });
    this.socket.on('disconnect', () => { this._$connected.set(false); this._$sessionId.set(undefined); }); 


    // this.messages$ = fromEvent<Message<any>>(this.socket, 'msg').pipe(
    //   filter<Message<any>>((msg) => msg._type !== MsgType.evt && msg._type !== MsgType.rsp)
    // );

    // const connect$ = fromEvent(this.socket, 'connect').pipe(map(() => { 
    //   console.log("Connected",this.socket.id);
    //   this.$socketId.set(this.socket.id); 
    //   return <Event>{ _type: EventType.connect } 
    // }));

    // const disconnect$ = fromEvent(this.socket, 'disconnect').pipe(map((info) => { 
    //   console.log("Disconnected",this.socket.id);
    //   this.$socketId.set(this.socket?.id);
    //   return <Event>{ _type: EventType.disconnect, info } 
    // }));

    // const messages$ = fromEvent<Message<any>>(this.socket, 'msg').pipe(
    //   filter((msg) => msg._type === MsgType.evt),
    //   map((msg) => { return <Event>{ _type: EventType.server, info: { topic: msg.topic, payload: msg.payload } } })
    // )

    // this.events$ = messages$.pipe(mergeWith(connect$, disconnect$));

    // this.events$.pipe(
    //   filter( (e) => e._type == EventType.server && e.info.topic==="clientId"),
    //   tap( e => { this.clientId = e.info.payload })
    // ).subscribe();

    //this.events$ = fromEvent<IEvent<any>>(this.socket, 'event');
    this.socket.on("event", async (event:IEvent<any>, cb) => {
      cb({ status: 'ok' });
      this._$events.set(event);
    });

    this.socket.on("request", async (request:IMessage<any>, cb) => {
      console.log(`${ITdt()} <CORE> [requesting] by server:`, request.topic);
      try {
        const serviceName = request.topic.split('.')[0];
        const methodName = request.topic.split('.')[1];
        const auth = this._$auth();
        const mapItem = this.servicesMap.get(serviceName);
        if(!mapItem) throw new Error('Service not found');
        const service = mapItem.service;
        const requiresAuth = mapItem.requiresAuth;
        if (requiresAuth && !auth) throw new Error('Not loggedin');
        const data = await (<any>service)[methodName](request.payload);
        console.log(`${ITdt()} <CORE> [request] by server:`, request,'executed with rv:', data);
        cb({ data });
      } catch (err:any) {
        console.error(`${ITdt()} <CORE> err:`, err['message']);
        cb({ err: err['message'] });
      }
    });
  }

  register(serviceName: string, service: BaseService, requiresAuth = true) {
    this.servicesMap.set(serviceName, { service,requiresAuth });
    console.log(`${ITdt()} <CORE> [registered service]:`, serviceName);
  }

  send(topic: string, payload: any = null, dest: string[] = []) {
    const rv = this.socket.emit('message', { topic, payload, _type: MsgType.msg, _dest: dest },(rv:any)=>{
      console.log(`${ITdt()} <CORE> [sent]`,topic);
    });
  }

  async request<T>(topic: string, payload: any = null) {
    console.log(`${ITdt()} <CORE> [request]`,topic,payload);
    return new Promise<T | undefined>((resolve, reject) => {
      this.socket.emit('request', { topic, payload },(rv:IResponse<T>)=>{
        console.log(`${ITdt()} <CORE> [response]`,rv);
        if(rv.err) reject({message:rv.err}); 
        else resolve(rv.data);
      });
    });
  }

  async prisma<T>(topic: string, payload: any = null) {
    console.log(`${ITdt()} <CORE> [prisma]`,topic,payload);
    return new Promise<T | undefined>((resolve, reject) => {
      this.socket.emit('prisma', { topic, payload },(rv:IResponse<T>)=>{  
        console.log(`${ITdt()} <CORE> [response]`,rv);
        if(rv.err) reject({message:rv.err}); 
        else resolve(rv.data); 
      });
    });
  }

  async subscriptions(topic: 'clear' | 'add' | 'remove' | 'get', payload: string[] = []): Promise<IResponse<string[]>> {
    return new Promise<IResponse<string[]>>((resolve, reject) => {
      this.socket.emit('subscriptions', { topic, payload },(rv:string[])=>{ resolve({ data:rv }); });
    });
  }

  subscribe<T>(subscriptions: string[]) {
    const idx = crossTabCounter('subscribe_idx');
    const _stream = new Subject<T>();
    const stream = _stream.asObservable();
    effect(()=>{
      const event = this.$events();
      if(isMatching(event.name,subscriptions)) _stream.next(event.payload);
    });
    this.socket.emit('subscriptions', { topic:'add', payload:{ idx,subscriptions} });
    const unsubscribe = ()=> { this.socket.emit('subscriptions', { topic:'remove', payload:{ idx } }); }
    return { stream, unsubscribe };
  }

  

  // forse questo è superfluo ?
  private async auth<T>(topic: 'login' | 'logout' | 'refresh', payload: ILoginMsg | ILogoutMsg | IRefreshMsg ): Promise<IResponse<T>> {
    return new Promise<IResponse<T>>((resolve, reject) => {
      this.socket.emit('auth', { topic, payload },(rv:IResponse<T>)=>{ resolve(rv); });
    });
  }

  private setAuth(value: IAuth | undefined, withBroadcast:boolean=true):IAuth | undefined {
    console.log(`${ITdt()} <CORE> [setAuth]`,value);
    if(withBroadcast) this.broadcastChannel.postMessage({ topic: 'auth', payload: value });
    this._$auth.set(value);
    return value;
  }

  async login(username:string,password:string):Promise<IAuth | undefined> {
    const payload:ILoginMsg = { username, password, clientId: CLIENT_ID };
    const res = await this.auth<IAuth>("login",payload);
    //console.log("<CORE> [login]",res.data);
    return this.setAuth(res.data);
  }

  async logout() {
    this.setAuth(undefined);
    await this.auth<any>("logout",{ clientId: CLIENT_ID});
    this.clearLocalStorageExcept([CLIENT_ID_KEY]);
  }

  private async refresh() {
      const auth = this._$auth();
      if(!!auth && this._$connected()) {
          const res = await this.auth<IAuth>("refresh",{ clientId: CLIENT_ID, token:auth.token });
          this.setAuth(res.data);
      } 
  }

  private clearLocalStorageExcept(exceptions: string[]): void {
    console.log(`${ITdt()} <CORE> [clearing localStorage] Except:`,exceptions);
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !exceptions.includes(key)) localStorage.removeItem(key);
    }
  }
  
}

