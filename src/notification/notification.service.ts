import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from '../prisma/prisma.service';
import { FIREBASE_ADMIN } from '../firebase/firebase.module';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_ADMIN) private readonly firebase: admin.app.App,
  ) {}

  async sendNotification(userId: string, title: string, body: string) {
    // 1. Save logic
    const notification = await this.prisma.notification.create({
      data: {
        userId, // Assumes user exists. If not, Prisma will throw error due to foreign key.
        title,
        body,
        deliveryStatus: 'PENDING',
      },
    });

    // 2. Fetch user to get token
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user && user.fcmToken) {
      try {
        await this.firebase.messaging().send({
          token: user.fcmToken,
          notification: {
            title,
            body,
          },
        });

        // 3. Update status to SENT
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { deliveryStatus: 'SENT' },
        });
      } catch (error) {
        // 4. Update status to FAILED
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { deliveryStatus: 'FAILED' },
        });
      }
    }

    // Return the updated notification might be nice, but initial is okay. 
    // Let's refetch to be accurate or just return what we have (status might have changed)
    return this.prisma.notification.findUnique({ where: { id: notification.id } });
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
