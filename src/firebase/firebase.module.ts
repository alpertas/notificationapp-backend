import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const FIREBASE_ADMIN = 'FIREBASE_ADMIN';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: FIREBASE_ADMIN,
      useFactory: (configService: ConfigService) => {
        const serviceAccountPath = configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS');

        
        const serviceAccount = require(require('path').resolve(serviceAccountPath));

        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [FIREBASE_ADMIN],
})
export class FirebaseModule {}
