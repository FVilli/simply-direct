import { ISubscriptions } from '@simply-direct/common';
export declare function hash(text: string): string;
export declare function QUID(): string;
export declare function ITdt(dt?: Date): string;
export declare function isMatching(event: string, subscriptions: string[]): boolean;
export declare function distinctSubscriptions(subscriptions: ISubscriptions): string[];
