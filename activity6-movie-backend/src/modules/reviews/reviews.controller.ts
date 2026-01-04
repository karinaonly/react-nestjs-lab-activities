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
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
        return this.reviewsService.create(createReviewDto, req.user.id);
    }

    @Get()
    findAll() {
        return this.reviewsService.findAll();
    }

    @Get('movie/:movieId')
    findByMovie(@Param('movieId') movieId: string) {
        return this.reviewsService.findByMovie(+movieId);
    }

    @Get('movie/:movieId/average')
    getAverageRating(@Param('movieId') movieId: string) {
        return this.reviewsService.getAverageRating(+movieId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/my-reviews')
    findMyReviews(@Request() req) {
        return this.reviewsService.findByUser(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reviewsService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateReviewDto: UpdateReviewDto,
        @Request() req,
    ) {
        return this.reviewsService.update(+id, updateReviewDto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        const isAdmin = req.user.role === 'admin';
        return this.reviewsService.remove(+id, req.user.id, isAdmin);
    }
}
