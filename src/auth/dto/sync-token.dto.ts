import { IsNotEmpty, IsString } from 'class-validator';

export class SyncTokenDto {
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
