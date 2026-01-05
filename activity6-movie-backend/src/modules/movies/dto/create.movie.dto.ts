import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    genre: string;

    @IsString()
    @IsNotEmpty()
    producer: string;

    @IsString()
    @IsNotEmpty()
    director: string;

    @IsString()
    @IsNotEmpty()
    originalLanguage: string;

    @IsNotEmpty()
    @IsNumber()
    releaseDate: number;

    @IsOptional()
    @IsString()
    movieImage?: string;
}