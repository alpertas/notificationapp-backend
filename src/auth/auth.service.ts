import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncToken(userId: string, email: string, fcmToken: string) {
    return this.prisma.user.upsert({
      where: { id: userId },
      update: {
        fcmToken,
        email, // Keep email updated if it changes (though UID is primary)
      },
      create: {
        id: userId,
        email,
        fcmToken,
      },
    });
  }
}
