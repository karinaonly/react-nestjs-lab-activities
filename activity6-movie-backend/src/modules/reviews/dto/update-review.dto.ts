import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
    @ApiProperty({ description: 'Review rating (1-5)', example: 4, minimum: 1, maximum: 5, required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiProperty({ description: 'Review comment', example: 'Updated comment', required: false })
    @IsOptional()
    @IsString()
    comment?: string;
}
