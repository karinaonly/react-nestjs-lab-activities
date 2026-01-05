import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AdminGuard)
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  async getStats() {
    try {
      return await this.usersService.getStats();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('profile')
  async getProfile(@Request() req) {
    try {
      console.log('Profile request for user:', req.user);
      const userId = req.user.sub || req.user.id;
      console.log('Fetching profile for user ID:', userId);
      const profile = await this.usersService.findOne(userId);
      console.log('Profile fetched:', profile);
      return profile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    try {
      const userId = parseInt(id);
      
      // Users can only view their own profile unless they're admin
      if (req.user.role !== 'admin' && req.user.sub !== userId) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      return await this.usersService.findOne(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    try {
      const userId = parseInt(id);
      
      // Users can only update their own profile unless they're admin
      if (req.user.role !== 'admin' && req.user.sub !== userId) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      // Non-admin users cannot change their role
      if (req.user.role !== 'admin' && updateUserDto.role) {
        throw new HttpException(
          'You do not have permission to change user roles',
          HttpStatus.FORBIDDEN,
        );
      }

      return await this.usersService.update(userId, updateUserDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(parseInt(id));
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
