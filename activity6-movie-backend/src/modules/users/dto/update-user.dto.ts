import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User email address', example: 'newemail@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'User password (min 6 characters)', example: 'newpassword123', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'User role', enum: ['user', 'admin'], required: false })
  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: 'user' | 'admin';

  @ApiProperty({ description: 'Username', example: 'jane_doe', required: false })
  @IsString()
  @IsOptional()
  username?: string;
}
