import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
dotenv.config();

const dir = process.env.NODE_ENV == 'migration' ? 'src' : 'dist';
export default <TypeOrmModuleOptions>{
    type: process.env.DATABASE_CONNECTION,
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [`${dir}/**/*.entity.{js,ts}`],
    migrations: [`${dir}/models/migrations/*.{js,ts}`],
    cli: {
        migrationsDir: `${dir}/models/migrations`,
        entitiesDir: `${dir}/models/entities`,
    },
    autoLoadEntities: true,
    synchronize: false,
    logging: true,
};
