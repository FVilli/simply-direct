import { ISubscriptions } from "./interfaces";
export declare function delay(ms: number): Promise<unknown>;
export declare function ITdt(dt?: Date): string;
export declare function isMatching(event: string, subscriptions: string[]): boolean;
export declare function distinctSubscriptions(subscriptions: ISubscriptions): string[];
export declare function crossTabCounter(name: string): number;
export declare function clone<T>(obj: T): T;
//# sourceMappingURL=functions.d.ts.map