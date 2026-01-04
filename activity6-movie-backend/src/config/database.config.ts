import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Movie } from "../modules/movies/entities/movies";
import { User } from "../modules/users/entities/user";
import { Review } from "../modules/reviews/entities/review";


export const DatabaseConfig =  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [Movie, User, Review],
        synchronize: config.get<string>('DB_SYNC') === 'true',
    })
})