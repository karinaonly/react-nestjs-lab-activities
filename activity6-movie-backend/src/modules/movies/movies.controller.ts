import { Controller, Get, Param, Body, Post, Put, Delete, UseGuards, UploadedFile, UseInterceptors, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create.movie.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

const movieImagesPath = join(process.cwd(), 'movie-images');
if (!existsSync(movieImagesPath)) {
    mkdirSync(movieImagesPath, { recursive: true });
}

const storage = diskStorage({
    destination: movieImagesPath,
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
});

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get('all')
    @ApiOperation({ summary: 'Get all movies', description: 'Retrieve a list of all movies' })
    @ApiResponse({ status: 200, description: 'List of movies retrieved successfully' })
    getAllMovies() {
        return this.moviesService.getAllMovies();
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get movie by ID', description: 'Retrieve a specific movie by its ID' })
    @ApiParam({ name: 'id', description: 'Movie ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Movie retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    getMovieById(@Param('id') id: number) {
        return this.moviesService.getMovieById(id);
    }

    @Post('create')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('image', { storage }))
    @ApiBearerAuth('access-token')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create new movie', description: 'Create a new movie (Admin only)' })
    @ApiResponse({ status: 201, description: 'Movie created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    createMovie(@Body() createMovieDto: CreateMovieDto, @UploadedFile() file?: any, @Request() req?: any) {
        console.log('=== CREATE MOVIE DEBUG ===');
        console.log('File received:', file?.filename || 'NO FILE');
        console.log('File object:', file);
        console.log('Raw body keys:', Object.keys(createMovieDto));
        
        // Remove the image field from DTO if it exists (it shouldn't be there)
        const { image, ...cleanDto } = createMovieDto as any;
        
        const payload = {
            ...cleanDto,
            movieImage: file ? `/movie-images/${file.filename}` : null,
        };
        
        console.log('Final payload:', payload);
        console.log('========================');
        return this.moviesService.createMovie(payload);
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('image', { storage }))
    @ApiBearerAuth('access-token')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update movie', description: 'Update an existing movie (Admin only)' })
    @ApiParam({ name: 'id', description: 'Movie ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Movie updated successfully' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    updateMovie(
        @Param('id') id: number,
        @Body() updateMovieDto: UpdateMovieDto,
        @UploadedFile() file?: any,
    ) {
        const payload = {
            ...updateMovieDto,
        };
        
        // Only update movieImage if a new file is provided
        if (file) {
            payload.movieImage = `/movie-images/${file.filename}`;
        }
        
        return this.moviesService.updateMovie(id, payload);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete movie', description: 'Delete a movie (Admin only)' })
    @ApiParam({ name: 'id', description: 'Movie ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Movie deleted successfully' })
    @ApiResponse({ status: 404, description: 'Movie not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    deleteMovie(@Param('id') id: number) {
        return this.moviesService.deleteMovie(id);
    }

    @Delete('delete-image/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete movie image', description: 'Delete the image file for a movie (Admin only)' })
    @ApiParam({ name: 'id', description: 'Movie ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Image deleted successfully' })
    @ApiResponse({ status: 404, description: 'Movie or image not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    async deleteMovieImage(@Param('id') id: number) {
        return this.moviesService.deleteMovieImage(id);
    }
}

