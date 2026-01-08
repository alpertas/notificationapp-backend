import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Order Status Update',
    description: 'Title of the push notification',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(50, { message: 'Title must be at most 50 characters' })
  title: string;

  @ApiProperty({
    example: 'Your order #12345 has been shipped!',
    description: 'Body content of the push notification',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Body must be at least 10 characters' })
  @MaxLength(250, { message: 'Body must be at most 250 characters' })
  body: string;
}
