import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '3000'),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'secretKey',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  SKIP_AUTH: process.env.SKIP_AUTH === 'true',
  NOT_ALLOWED_PRISMA_METHODS: process.env.NOT_ALLOWED_PRISMA_METHODS?.split(',') || ['deleteMany','updateMany'],
};