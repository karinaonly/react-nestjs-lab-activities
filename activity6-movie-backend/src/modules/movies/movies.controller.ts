import { Controller, Get, Param, Body, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create.movie.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

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
    createMovie(@Body() createMovieDto: CreateMovieDto) {
        return this.moviesService.createMovie(createMovieDto);
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    updateMovie(@Param('id') id: number, @Body() updateMovieDto: UpdateMovieDto) {
        return this.moviesService.updateMovie(id, updateMovieDto);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    deleteMovie(@Param('id') id: number) {
        return this.moviesService.deleteMovie(id);
    }
}

