"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = delay;
exports.ITdt = ITdt;
exports.isMatching = isMatching;
exports.distinctSubscriptions = distinctSubscriptions;
exports.crossTabCounter = crossTabCounter;
exports.clone = clone;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function ITdt(dt = new Date()) {
    return new Intl.DateTimeFormat('it-IT', {
        timeZone: 'Europe/Rome',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(dt);
}
function isMatching(event, subscriptions) {
    if (subscriptions.includes('**'))
        return true;
    const eventParts = event.split('.');
    return subscriptions.some((sub) => {
        const subParts = sub.split('.');
        if (subParts.length !== eventParts.length)
            return false;
        return subParts.every((part, index) => part === '*' || part === eventParts[index]);
    });
}
function distinctSubscriptions(subscriptions) {
    const distinct = new Set();
    Object.values(subscriptions).forEach((arr) => { arr.forEach((str) => distinct.add(str)); });
    return Array.from(distinct);
}
function crossTabCounter(name) {
    const key = `_CTC_${name}`;
    const value = localStorage.getItem(key);
    const counter = value ? parseInt(value) : 0;
    localStorage.setItem(key, (counter + 1).toString());
    return counter;
}
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
//# sourceMappingURL=functions.js.map