import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPremium } from 'src/models/entities/user-premium.entity';
import { PremiumPackageService } from './premium-package.service';
import { PremiumPackage } from 'src/models/entities/premium-package.entity';
import { PremiumPackageController } from './premium-package.controller';
import { Profile } from 'src/models/entities/profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PremiumPackage, UserPremium, Profile])],
    providers: [PremiumPackageService],
    controllers: [PremiumPackageController],
})
export class PremiumPackageModule {}
