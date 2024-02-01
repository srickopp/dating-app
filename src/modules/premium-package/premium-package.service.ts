import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PremiumPackage } from '../../models/entities/premium-package.entity';
import { UserPremium } from '../../models/entities/user-premium.entity';
import { Profile } from '../../models/entities/profile.entity';
import { OrderPremiumPackageDto } from './dto/order-package.dto';

@Injectable()
export class PremiumPackageService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        @InjectRepository(PremiumPackage)
        private readonly premiumPackageRepository: Repository<PremiumPackage>,
        @InjectRepository(UserPremium)
        private readonly userPremiumRepository: Repository<UserPremium>,
    ) {}

    async listPremiumPackage() {
        const packages = await this.premiumPackageRepository.find();
        return {
            message: 'List Premium Package',
            data: packages,
        };
    }

    async orderPremiumPackage(
        userId: string,
        orderDto: OrderPremiumPackageDto,
    ) {
        const packageId = orderDto.package_id;
        const profile = await this.profileRepository.findOne({
            where: {
                user_id: userId,
            },
        });

        // Check if the user has already purchased the premium package
        const existingOrder = await this.userPremiumRepository.findOne({
            where: {
                profile_id: profile.id,
                package_id: packageId,
            },
        });

        if (existingOrder) {
            throw new NotFoundException('Premium package already purchased');
        }

        // Fetch the premium package details
        const premiumPackage = await this.premiumPackageRepository.findOne({
            where: {
                id: packageId,
            },
        });

        if (!premiumPackage) {
            throw new NotFoundException('Premium package not found');
        }

        await this.userPremiumRepository.insert({
            profile_id: profile.id,
            package_id: premiumPackage.id,
            start_date: new Date(),
            end_date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        });

        premiumPackage.total_purchased_user =
            premiumPackage.total_purchased_user + 1;

        await this.premiumPackageRepository.update(
            {
                id: packageId,
            },
            {
                total_purchased_user: premiumPackage.total_purchased_user + 1,
            },
        );

        return {
            message: 'Success Order Premium Package',
        };
    }
}
