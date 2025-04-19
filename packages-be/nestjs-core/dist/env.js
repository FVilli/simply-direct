"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.ENV = {
    PORT: parseInt(process.env.PORT || '3000'),
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'secretKey',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    SKIP_AUTH: process.env.SKIP_AUTH === 'true',
    NOT_ALLOWED_PRISMA_METHODS: ((_a = process.env.NOT_ALLOWED_PRISMA_METHODS) === null || _a === void 0 ? void 0 : _a.split(',')) || ['deleteMany', 'updateMany'],
};
//# sourceMappingURL=env.js.map