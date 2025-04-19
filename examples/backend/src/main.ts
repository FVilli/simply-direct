import { ENV } from './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { ITdt } from '@common/functions';

console.log('ENV', ENV);

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));

  server.use(express.static(join(__dirname, '../../web-ui/browser')));
  server.use('/docs', express.static(join(__dirname, '../../docs')));
  server.get('*all', (req, res) => {
    res.sendFile(join(__dirname, '../../web-ui/browser', 'index.html'));
  });

  const UID = process.getuid();
  const GID = process.getgid();

  await app.listen(ENV.PORT, '0.0.0.0');

  console.log('-----------------------------------------------------------------');
  console.log(`${ITdt()} Node.js Version:`, process.version);
  console.log(`Application is running and listening on port:${ENV.PORT}`);
  console.log(`Process running as ${UID}:${GID} (UserID:${UID}, GroupID:${GID})`);
  console.log('-----------------------------------------------------------------');
}
bootstrap();
