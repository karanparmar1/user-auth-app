import * as dotenv from 'dotenv';
dotenv.config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as fs from 'fs';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { SERVER_CONFIG } from './common/constants';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    bufferLogs: true,
    logger: ['log', 'error', 'verbose']
  });

  const logger = app.get(Logger);

  app.useLogger(logger); // Global logger (using pino)

  app.use(helmet());
  app.use(cookieParser());

  app.enableCors({
    origin: '*',
    // origin: [
    //   SERVER_CONFIG.FRONTEND_URL,
    //   'http://localhost',
    //   'https://localhost',
    //   'http://127.0.0.1',
    //   'https://127.0.0.1',
    // ],
    credentials: true, // To ensure cookies and tokens are included in requests
  });

  // store CSRF token in cookie
  // app.use(
  //   csurf({
  //     cookie: true,
  //   }),
  // );

  // Global validation - To validate incoming data from every route from DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  await app.listen(SERVER_CONFIG.PORT, async () => {
    logger.log(`Server running on port ${SERVER_CONFIG.PORT}`);
    logger.log(` *** Application is running on -> ${await app.getUrl()} *** `);
  });

}

bootstrap().catch((err) => {
  console.error('Error during app initialization', err);
});
