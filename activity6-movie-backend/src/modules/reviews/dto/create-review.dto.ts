import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
    @ApiProperty({ description: 'Movie ID', example: 1 })
    @IsNotEmpty()
    @IsInt()
    movieId: number;

    @ApiProperty({ description: 'Review rating (1-5)', example: 5, minimum: 1, maximum: 5 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({ description: 'Review comment', example: 'Great movie!', required: false })
    @IsOptional()
    @IsString()
    comment?: string;
}
