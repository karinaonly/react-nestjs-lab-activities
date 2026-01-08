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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Create review', description: 'Create a new review for a movie' })
    @ApiResponse({ status: 201, description: 'Review created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
        return this.reviewsService.create(createReviewDto, req.user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all reviews', description: 'Retrieve all reviews' })
    @ApiResponse({ status: 200, description: 'List of reviews retrieved successfully' })
    findAll() {
        return this.reviewsService.findAll();
    }

    @Get('movie/:movieId')
    @ApiOperation({ summary: 'Get reviews by movie', description: 'Get all reviews for a specific movie' })
    @ApiParam({ name: 'movieId', description: 'Movie ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
    findByMovie(@Param('movieId') movieId: string) {
        return this.reviewsService.findByMovie(+movieId);
    }

    @Get('movie/:movieId/average')
    @ApiOperation({ summary: 'Get average rating', description: 'Get average rating for a specific movie' })
    @ApiParam({ name: 'movieId', description: 'Movie ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Average rating retrieved successfully' })
    getAverageRating(@Param('movieId') movieId: string) {
        return this.reviewsService.getAverageRating(+movieId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/my-reviews')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get my reviews', description: 'Get all reviews by the authenticated user' })
    @ApiResponse({ status: 200, description: 'User reviews retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    findMyReviews(@Request() req) {
        return this.reviewsService.findByUser(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get review by ID', description: 'Retrieve a specific review by its ID' })
    @ApiParam({ name: 'id', description: 'Review ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Review retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Review not found' })
    findOne(@Param('id') id: string) {
        return this.reviewsService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Update review', description: 'Update an existing review (own review or Admin)' })
    @ApiParam({ name: 'id', description: 'Review ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Review updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 404, description: 'Review not found' })
    update(
        @Param('id') id: string,
        @Body() updateReviewDto: UpdateReviewDto,
        @Request() req,
    ) {
        return this.reviewsService.update(+id, updateReviewDto, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Delete review', description: 'Delete a review (own review or Admin)' })
    @ApiParam({ name: 'id', description: 'Review ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Review deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - JWT token required' })
    @ApiResponse({ status: 404, description: 'Review not found' })
    remove(@Param('id') id: string, @Request() req) {
        const isAdmin = req.user.role === 'admin';
        return this.reviewsService.remove(+id, req.user.id, isAdmin);
    }
}
