import { Inject, Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from '../prisma/prisma.service';
import { FIREBASE_ADMIN } from '../firebase/firebase.module';
import { DeliveryStatus } from './enums/delivery-status.enum';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(FIREBASE_ADMIN) private readonly firebase: admin.app.App,
  ) { }

  private async ensureUserExists(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      this.logger.log(`User not found in DB. Creating new user: ${email} (${userId})`);
      await this.prisma.user.create({
        data: {
          id: userId,
          email: email,
        },
      });
    }
  }

  async createNotification(userId: string, title: string, body: string, email: string) {
    await this.ensureUserExists(userId, email);

    return this.prisma.notification.create({
      data: {
        userId,
        title,
        body,
        deliveryStatus: DeliveryStatus.PENDING,
      },
    });
  }

  async sendNotification(userId: string, title: string, body: string, email: string) {
    await this.ensureUserExists(userId, email);

    const notification = await this.prisma.notification.create({
      data: {
        userId,
        title,
        body,
        deliveryStatus: DeliveryStatus.PENDING,
      },
    });

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

        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { deliveryStatus: DeliveryStatus.SENT },
        });

        this.logger.log(`Notification sent to user ${userId}`);

      } catch (error) {
        this.logger.error(`Failed to send FCM to user ${userId}`, error);

        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { deliveryStatus: DeliveryStatus.FAILED },
        });
      }
    } else {
      this.logger.warn(`User ${userId} has no FCM Token. Notification saved but not sent.`);
    }

    return this.prisma.notification.findUnique({ where: { id: notification.id } });
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
  }
}