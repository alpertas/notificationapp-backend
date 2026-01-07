import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SyncTokenDto {
  @ApiProperty({
    example: 'd1a2s3d4:f5g6h7j8k9l0...',
    description: 'Firebase Cloud Messaging (FCM) device token',
  })
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
