import { PrismaClient, User } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('base64');
}

async function createSpecialUserIfNotExists(name: string): Promise<User> {
  let user = await prisma.user.findFirst({ where: { name } });
  if (!user) {
    const role = name.toUpperCase();
    const password = `_${name}0!`;
    const phash = hash(password);
    user = await prisma.user.create({ data: { name, role, phash } });
    console.log(`User "${name}" created with role:${role} and password:"${password}"`);
  }
  return user;
}

async function main() {
  await createSpecialUserIfNotExists('admin');
  await createSpecialUserIfNotExists('user');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
