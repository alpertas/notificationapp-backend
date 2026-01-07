import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Order Status Update',
    description: 'Title of the push notification',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Your order #12345 has been shipped!',
    description: 'Body content of the push notification',
  })
  @IsString()
  @IsNotEmpty()
  body: string;
}
