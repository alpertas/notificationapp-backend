import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SyncTokenDto } from './dto/sync-token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync-token')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync FCM token for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Token successfully synced' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async syncToken(@Req() req: any, @Body() syncTokenDto: SyncTokenDto) {
    const { uid, email } = req.user;
    return this.authService.syncToken(uid, email, syncTokenDto.fcmToken);
  }
}
