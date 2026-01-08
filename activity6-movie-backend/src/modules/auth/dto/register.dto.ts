import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password (min 6 characters)', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User role', enum: ['user', 'admin'], example: 'user', required: false })
  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: 'user' | 'admin';

  @ApiProperty({ description: 'Username', example: 'john_doe', required: false })
  @IsString()
  @IsOptional()
  username?: string;
}
