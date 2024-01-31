import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SwipeModule } from './modules/swipe/swipe.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremiumPackageModule } from './modules/premium-package/premium-package.module';
import ormconfig from './ormconfig';
@Module({
    imports: [
        TypeOrmModule.forRoot(ormconfig),
        AuthModule,
        PremiumPackageModule,
        ProfileModule,
        SwipeModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
