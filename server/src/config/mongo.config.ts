import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { SERVER_CONFIG } from '../common/constants';

export const MongoConfig = MongooseModule.forRootAsync({
  useFactory: (): MongooseModuleFactoryOptions => ({
    uri: SERVER_CONFIG.MONGO_URI,
    connectTimeoutMS: 10000, // Fail after 10 seconds if connection can't be made
    serverSelectionTimeoutMS: 5000, // Fail after 5 seconds if no MongoDB server is found
    socketTimeoutMS: 10000, // Timeout the socket if idle for more than 10 seconds
  }),
});

// export const MongoConfig = MongooseModule.forRoot(SERVER_CONFIG.MONGO_URI);
// export const MongoConfig = MongooseModule.forRootAsync({
//   imports: [ConfigModule],
//   useFactory: async (configService: ConfigService) => ({
//     uri: configService.get<string>('MONGO_URI'),
//   }),
//   inject: [ConfigService],
// });
