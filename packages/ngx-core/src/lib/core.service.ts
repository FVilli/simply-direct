import { Injectable, inject } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject, Observable, fromEvent, timer } from 'rxjs';
import { filter, map, retryWhen, delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private socket: Socket | null = null;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 2000;

  constructor() {}

  connect(url: string): void {
    if (this.socket) {
      this.socket.close();
    }

    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: false // Gestiamo manualmente la riconnessione
    });

    this.socket.on('connect', () => {
      this.connectionStatus.next(true);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      this.connectionStatus.next(false);
      this.attemptReconnect(url);
    });
  }

  private attemptReconnect(url: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      timer(this.reconnectDelay).subscribe(() => {
        this.connect(url);
      });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connectionStatus.next(false);
    }
  }

  isConnected(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  emit<T>(event: string, data?: T): void {
    if (this.socket && this.connectionStatus.value) {
      this.socket.emit(event, data);
    }
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>(observer => {
      if (!this.socket) {
        observer.error('Socket not connected');
        return;
      }

      this.socket.on(event, (data: T) => {
        observer.next(data);
      });

      return () => {
        if (this.socket) {
          this.socket.off(event);
        }
      };
    }).pipe(
      filter(() => this.connectionStatus.value)
    );
  }
}