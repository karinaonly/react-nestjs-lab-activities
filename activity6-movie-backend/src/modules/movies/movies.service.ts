import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Movie } from './entities/movies';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/create.movie.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';

@Injectable()
export class MoviesService {
    constructor(@InjectRepository(Movie) private readonly moviesRepo: Repository<Movie>) {}

    async getAllMovies(){
        return this.moviesRepo.find();
    }

    async getMovieById(movieId: number){
        return this.moviesRepo.findOneBy({movieId});
    }

    async createMovie(createMovieDto: CreateMovieDto){
        const newMovie = this.moviesRepo.create(createMovieDto);
        return this.moviesRepo.save(newMovie);
    }

    async updateMovie(movieId: number, updateMovieDto: UpdateMovieDto){
        await this.moviesRepo.update(movieId, updateMovieDto);
        return this.getMovieById(movieId);
    }

    async deleteMovie(movieId: number){
        return this.moviesRepo.delete(movieId);
    }
}
