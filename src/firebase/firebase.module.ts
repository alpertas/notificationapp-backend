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
        
        // Ensure path resolves correctly or use require if it's a relative JSON file
        // For simplicity with the provided setup, using require or simple path might be tricky depending on how file is read.
        // However, admin.initializeApp({ credential: admin.credential.cert(...) }) is standard.
        // We will assume the path is correct relative to CWD.
        // Or better yet, we can load it using `require`.
        
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
