import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
    @ApiProperty({ description: 'Movie title', example: 'Inception' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Movie description', example: 'A mind-bending thriller...' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Movie genre', example: 'Sci-Fi' })
    @IsString()
    @IsNotEmpty()
    genre: string;

    @ApiProperty({ description: 'Movie producer', example: 'Emma Thomas' })
    @IsString()
    @IsNotEmpty()
    producer: string;

    @ApiProperty({ description: 'Movie director', example: 'Christopher Nolan' })
    @IsString()
    @IsNotEmpty()
    director: string;

    @ApiProperty({ description: 'Original language', example: 'English' })
    @IsString()
    @IsNotEmpty()
    originalLanguage: string;

    @ApiProperty({ description: 'Release date as timestamp', example: 1246579200000 })
    @IsNotEmpty()
    @IsNumber()
    releaseDate: number;

    @ApiProperty({ description: 'Movie image URL', example: '/movie-images/image.jpg', required: false })
    @IsOptional()
    @IsString()
    movieImage?: string | null;
}