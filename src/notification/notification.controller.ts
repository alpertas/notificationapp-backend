import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Req() req: any, @Body() createNotificationDto: CreateNotificationDto) {
    const { uid } = req.user;
    return this.notificationService.sendNotification(
      uid,
      createNotificationDto.title,
      createNotificationDto.body,
    );
  }

  @Get()
  async findAll(@Req() req: any) {
    const { uid } = req.user;
    return this.notificationService.getNotifications(uid);
  }
}
