import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
    ) {}

    async create(createReviewDto: CreateReviewDto, userId: number): Promise<Review> {
        // Check if user already reviewed this movie
        const existingReview = await this.reviewsRepository.findOne({
            where: { movieId: createReviewDto.movieId, userId },
        });

        if (existingReview) {
            throw new ForbiddenException('You have already reviewed this movie');
        }

        const review = this.reviewsRepository.create({
            ...createReviewDto,
            userId,
        });

        return this.reviewsRepository.save(review);
    }

    async findAll(): Promise<Review[]> {
        return this.reviewsRepository.find({
            relations: ['user', 'movie'],
        });
    }

    async findByMovie(movieId: number): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { movieId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByUser(userId: number): Promise<Review[]> {
        return this.reviewsRepository.find({
            where: { userId },
            relations: ['movie'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Review> {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['user', 'movie'],
        });

        if (!review) {
            throw new NotFoundException(`Review with ID ${id} not found`);
        }

        return review;
    }

    async update(id: number, updateReviewDto: UpdateReviewDto, userId: number): Promise<Review> {
        const review = await this.findOne(id);

        // Only the user who created the review can update it
        if (review.userId !== userId) {
            throw new ForbiddenException('You can only update your own reviews');
        }

        Object.assign(review, updateReviewDto);
        return this.reviewsRepository.save(review);
    }

    async remove(id: number, userId: number, isAdmin: boolean = false): Promise<void> {
        const review = await this.findOne(id);

        // Only the user who created the review or an admin can delete it
        if (review.userId !== userId && !isAdmin) {
            throw new ForbiddenException('You can only delete your own reviews');
        }

        await this.reviewsRepository.remove(review);
    }

    async getAverageRating(movieId: number): Promise<{ averageRating: number; totalReviews: number }> {
        const result = await this.reviewsRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'averageRating')
            .addSelect('COUNT(review.id)', 'totalReviews')
            .where('review.movieId = :movieId', { movieId })
            .getRawOne();

        return {
            averageRating: parseFloat(result.averageRating) || 0,
            totalReviews: parseInt(result.totalReviews) || 0,
        };
    }
}
