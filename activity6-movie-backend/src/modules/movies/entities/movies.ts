import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "movies"})
export class Movie{

    @PrimaryGeneratedColumn()
    movieId: number;

    @Column()
    title: string;

    @Column({type: "text"})
    description: string;

    @Column()
    producer: string;

    @Column()
    director: string;

    @Column()
    originalLanguage: string;

    @Column()
    genre: string;

    @Column({ nullable: true })
    releaseDate: number;

    @Column({ type: "varchar", nullable: true })
    movieImage?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}