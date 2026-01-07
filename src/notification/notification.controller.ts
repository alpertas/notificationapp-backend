import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a notification (DB Only)' })
  @ApiResponse({ status: 201, description: 'Notification created with PENDING status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createOnly(@Req() req: any, @Body() createNotificationDto: CreateNotificationDto) {
    const { uid, email } = req.user;
    return this.notificationService.createNotification(
      uid,
      createNotificationDto.title,
      createNotificationDto.body,
      email,
    );
  }

  @Post('send')
  @ApiOperation({ summary: 'Create and Send a push notification' })
  @ApiResponse({ status: 201, description: 'Notification sent and saved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async send(@Req() req: any, @Body() createNotificationDto: CreateNotificationDto) {
    const { uid, email } = req.user;
    return this.notificationService.sendNotification(
      uid,
      createNotificationDto.title,
      createNotificationDto.body,
      email,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get notification history' })
  @ApiResponse({ status: 200, description: 'List of past notifications' })
  async findAll(@Req() req: any) {
    const { uid } = req.user;
    return this.notificationService.getNotifications(uid);
  }
}
