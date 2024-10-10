import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
// import { ConfigModule } from '@nestjs/config';
import { MongoConfig } from './config/mongo.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true, // To Load config and env anywhere without importing
    //   envFilePath: '.env',
    // }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info', // Only logs 'info' level and above (info, warn, error, fatal)
        stream: process.stdout,
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            options: {
              singleLine: true,
              colorize: true,
            },
          },
        },
      },
    }),
    MongoConfig,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
