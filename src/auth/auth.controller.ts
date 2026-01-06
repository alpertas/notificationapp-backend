import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SyncTokenDto } from './dto/sync-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sync-token')
  @UseGuards(AuthGuard)
  async syncToken(@Req() req: any, @Body() syncTokenDto: SyncTokenDto) {
    const { uid, email } = req.user;
    return this.authService.syncToken(uid, email, syncTokenDto.fcmToken);
  }
}
