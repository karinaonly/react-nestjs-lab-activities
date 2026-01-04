import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Movie } from "../../movies/entities/movies";
import { User } from "../../users/entities/user";

@Entity({ name: 'reviews' })
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    movieId: number;

    @Column()
    userId: number;

    @Column({ type: 'int' })
    rating: number; // 1-5 stars

    @Column({ type: 'text', nullable: true })
    comment: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Movie, (movie) => movie.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'movieId' })
    movie: Movie;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
