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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('stats')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user statistics', description: 'Get user count statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getStats() {
    try {
      return await this.usersService.getStats();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current user profile', description: 'Retrieve the profile of the authenticated user' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 404, description: 'User profile not found' })
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
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieve a specific user (own profile or Admin)' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only view own profile or Admin' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create new user', description: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update user', description: 'Update a user (own profile or Admin)' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only update own profile or Admin' })
  @ApiResponse({ status: 404, description: 'User not found' })
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
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Archive user', description: 'Archive a user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User archived successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(parseInt(id));
      return { message: 'User archived successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
