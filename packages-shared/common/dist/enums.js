"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgType = exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["connect"] = "connect";
    EventType["disconnect"] = "disconnect";
})(EventType || (exports.EventType = EventType = {}));
var MsgType;
(function (MsgType) {
    MsgType["msg"] = "msg";
    MsgType["rqst"] = "rqst";
    MsgType["rsp"] = "rsp";
    MsgType["evt"] = "evt";
})(MsgType || (exports.MsgType = MsgType = {}));
//# sourceMappingURL=enums.js.map