import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Movie } from './entities/movies';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/create.movie.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { ReviewsService } from '../reviews/reviews.service';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie) private readonly moviesRepo: Repository<Movie>,
        private readonly reviewsService: ReviewsService,
    ) {}

    async getAllMovies() {
        const movies = await this.moviesRepo.find();
        
        // Add average rating to each movie
        const moviesWithRatings = await Promise.all(
            movies.map(async (movie) => {
                const ratingData = await this.reviewsService.getAverageRating(movie.movieId);
                return {
                    ...movie,
                    averageRating: ratingData.averageRating,
                    totalReviews: ratingData.totalReviews,
                };
            })
        );
        
        return moviesWithRatings;
    }

    async getMovieById(movieId: number) {
        const movie = await this.moviesRepo.findOneBy({ movieId });
        
        if (movie) {
            const ratingData = await this.reviewsService.getAverageRating(movieId);
            return {
                ...movie,
                averageRating: ratingData.averageRating,
                totalReviews: ratingData.totalReviews,
            };
        }
        
        return movie;
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
