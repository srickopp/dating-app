import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const dir = process.env.NODE_ENV == 'migration' ? 'src' : 'dist';
export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrationsTableName: 'migrations',
  logging: false,
  synchronize: false,
  name: 'default',
  entities: [`${dir}/**/*.entity.{js,ts}`],
  migrations: [`${dir}/models/migrations/*.{js,ts}`],
});
