"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = hash;
exports.QUID = QUID;
exports.ITdt = ITdt;
exports.isMatching = isMatching;
exports.distinctSubscriptions = distinctSubscriptions;
const crypto = require("crypto");
function hash(text) {
    return crypto.createHash('sha256').update(text).digest('base64');
}
function QUID() {
    return crypto.randomUUID().substring(0, 8);
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
//# sourceMappingURL=utils.functions.js.map