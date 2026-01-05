import { Controller, Get, Param, Body, Post, Put, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
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

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get('all')
    getAllMovies() {
        return this.moviesService.getAllMovies();
    }

    @Get('/:id')
    getMovieById(@Param('id') id: number) {
        return this.moviesService.getMovieById(id);
    }

    @Post('create')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('image', { storage }))
    createMovie(@Body() createMovieDto: CreateMovieDto, @UploadedFile() file?: any) {
        const payload = {
            ...createMovieDto,
            movieImage: file ? `/movie-images/${file.filename}` : undefined,
        };
        return this.moviesService.createMovie(payload);
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('image', { storage }))
    updateMovie(
        @Param('id') id: number,
        @Body() updateMovieDto: UpdateMovieDto,
        @UploadedFile() file?: any,
    ) {
        const payload = {
            ...updateMovieDto,
            movieImage: file ? `/movie-images/${file.filename}` : undefined,
        };
        return this.moviesService.updateMovie(id, payload);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    deleteMovie(@Param('id') id: number) {
        return this.moviesService.deleteMovie(id);
    }
}

