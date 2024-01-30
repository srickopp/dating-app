import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SwipeModule } from './modules/swipe/swipe.module';
@Module({
    imports: [AuthModule, OrderModule, ProfileModule, SwipeModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
