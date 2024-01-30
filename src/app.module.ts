import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SwipeModule } from './modules/swipe/swipe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
@Module({
    imports: [
        TypeOrmModule.forRoot(ormconfig),
        AuthModule,
        OrderModule,
        ProfileModule,
        SwipeModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
