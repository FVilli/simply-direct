import { ISubscriptions } from "./interfaces";

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function ITdt(dt: Date = new Date()): string {
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome', // 🇮🇹 Fuso orario italiano
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(dt);
}

export function isMatching(event: string, subscriptions: string[]): boolean {
  if (subscriptions.includes('**')) return true;
  const eventParts = event.split('.');
  return subscriptions.some((sub) => {
    const subParts = sub.split('.');
    if (subParts.length !== eventParts.length) return false;
    return subParts.every((part, index) => part === '*' || part === eventParts[index]);
  });
}

export function distinctSubscriptions(subscriptions:ISubscriptions): string[] {
  const distinct = new Set<string>();
  Object.values(subscriptions).forEach( (arr:string[]) => { arr.forEach((str:string) => distinct.add(str));});
  return Array.from(distinct); 
}

export function crossTabCounter(name:string): number {
  const key = `_CTC_${name}`;
  const value = localStorage.getItem(key);
  const counter = value ? parseInt(value) : 0;
  localStorage.setItem(key, (counter + 1).toString());
  return counter;
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
