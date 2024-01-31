import { DataSource } from 'typeorm';
import { seedData } from './seed-data';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

async function runSeeder() {
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    await seedData(dataSource);
    await app.close();
}
runSeeder();
