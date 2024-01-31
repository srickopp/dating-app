import { Module } from '@nestjs/common';
import { SwipeService } from './swipe.service';
import { SwipeController } from './swipe.controller';
import { Swipe } from 'src/models/entities/swipe.entity';
import { Profile } from 'src/models/entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Profile, Swipe])],
    providers: [SwipeService],
    controllers: [SwipeController],
})
export class SwipeModule {}
