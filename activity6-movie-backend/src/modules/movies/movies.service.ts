import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Movie } from './entities/movies';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMovieDto } from './dto/create.movie.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { ReviewsService } from '../reviews/reviews.service';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';

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
        // Remove undefined values
        const cleanData = Object.keys(createMovieDto).reduce((acc, key) => {
            if (createMovieDto[key] !== undefined) {
                acc[key] = createMovieDto[key];
            }
            return acc;
        }, {});
        
        const newMovie = this.moviesRepo.create(cleanData);
        return this.moviesRepo.save(newMovie);
    }

    async updateMovie(movieId: number, updateMovieDto: UpdateMovieDto){
        // Remove undefined values and fields that don't belong to Movie entity
        const allowedFields = ['title', 'description', 'genre', 'producer', 'director', 'originalLanguage', 'releaseDate', 'movieImage'];
        const cleanData = Object.keys(updateMovieDto).reduce((acc, key) => {
            if (updateMovieDto[key] !== undefined && allowedFields.includes(key)) {
                acc[key] = updateMovieDto[key];
            }
            return acc;
        }, {});
        
        await this.moviesRepo.update(movieId, cleanData);
        return this.getMovieById(movieId);
    }

    async deleteMovie(movieId: number){
        return this.moviesRepo.delete(movieId);
    }

    async deleteMovieImage(movieId: number) {
        const movie = await this.moviesRepo.findOneBy({ movieId });
        
        if (!movie || !movie.movieImage) {
            return { message: 'Movie or image not found' };
        }

        // Extract filename from path and construct full file path
        const filename = movie.movieImage.replace('/movie-images/', '');
        const imagePath = join(process.cwd(), 'movie-images', filename);

        // Delete file from disk if it exists
        if (existsSync(imagePath)) {
            try {
                unlinkSync(imagePath);
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        }

        // Update database to remove movieImage reference
        await this.moviesRepo.update(movieId, { movieImage: null } as any);

        return { message: 'Image deleted successfully' };
    }
}
