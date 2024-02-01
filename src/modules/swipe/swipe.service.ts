import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import * as moment from 'moment';
import { Profile } from '../../models/entities/profile.entity';
import { Swipe } from '../../models/entities/swipe.entity';

@Injectable()
export class SwipeService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        @InjectRepository(Swipe)
        private readonly swipeRepository: Repository<Swipe>,
    ) {}

    async getNewMatchProfile(userId: string): Promise<Profile> {
        const profile = await this.profileRepository.findOne({
            where: {
                user_id: userId,
            },
            relations: ['premiums.package'],
        });

        const premiumsPackage = profile?.premiums || [];
        const { isPremiumVerified, isUnlimitedSwiped } =
            this.checkPremiums(premiumsPackage);

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        if (!isUnlimitedSwiped) {
            if (profile.daily_swipe_count >= 10) {
                // User has reached the daily swipe limit
                throw new BadRequestException(
                    "You've reached your daily limit",
                );
            }
        }

        const userIds = [userId];
        const maxAttempts = 10;
        let attempts = 0;

        while (attempts < maxAttempts) {
            const randomProfile = await this.getRandomProfile(
                userIds,
                this.getGenderPreferences(profile.gender),
                isPremiumVerified,
            );

            if (!randomProfile) {
                // No more available profiles
                throw new NotFoundException(
                    "You've reached all of the profile",
                );
            }

            const startOfDay = moment().startOf('day').toDate();
            const endOfDay = moment().endOf('day').toDate();

            // Check if the user has already swiped on this profile
            const hasSwiped = await this.swipeRepository.findOne({
                where: {
                    swiper_id: userId,
                    swiped_id: randomProfile.user_id,
                    created_at: Between(startOfDay, endOfDay),
                },
            });

            if (!hasSwiped) {
                return randomProfile;
            }

            userIds.push(hasSwiped.swiped_id);
            attempts++;
        }

        // Maximum attempts reached, return exception
        throw new NotFoundException("You've reached all of the profile");
    }

    async processSwipeAction(
        userId: string,
        swipedId: string,
        action: 'like' | 'pass',
    ) {
        try {
            if (action === 'like') {
                return await this.likeProfile(userId, swipedId);
            } else if (action === 'pass') {
                return await this.passProfile(userId, swipedId);
            } else {
                throw new BadRequestException('Invalid action');
            }
        } catch (error) {
            throw error;
        }
    }

    async likeProfile(
        swiperId: string,
        swipedId: string,
    ): Promise<{ message: string; profile: Profile; match_profile?: Profile }> {
        const [swiperProfile, swipedProfile] = await Promise.all([
            this.profileRepository.findOne({
                where: { user_id: swiperId },
            }),
            this.profileRepository.findOne({ where: { id: swipedId } }),
        ]);

        if (!swiperProfile || !swipedProfile) {
            throw new NotFoundException('Profiles not found');
        }

        // Check if the swiped profile has already liked the swiper profile
        const isMatch = await this.swipeRepository.findOne({
            where: {
                swiper_id: swipedId,
                swiped_id: swiperProfile.id,
                is_like: true,
            },
        });

        // Save the like action
        await this.createSwipe(swipedProfile.id, swipedId, true);
        await this.updateSwipeCounts(swipedProfile, true);

        if (isMatch) {
            return {
                message: 'Matched!',
                profile: swiperProfile,
                match_profile: swipedProfile,
            };
        }

        return {
            message: 'Continue searching',
            profile: swiperProfile,
        };
    }

    async passProfile(swiperId: string, swipedId: string) {
        try {
            // Check if the profiles exist and are different
            const [swiperProfile, swipedProfile] = await Promise.all([
                this.profileRepository.findOne({
                    where: { user_id: swiperId },
                }),
                this.profileRepository.findOne({ where: { id: swipedId } }),
            ]);

            if (!swiperProfile || !swipedProfile || swiperId === swipedId) {
                throw new NotFoundException('Invalid profiles');
            }

            // Perform the pass action and update swipe counts
            await this.createSwipe(swiperId, swipedId, false);
            await this.updateSwipeCounts(swiperProfile, false);

            return {
                message: 'Continue searching',
                profile: swiperProfile,
            };
        } catch (error) {
            throw error;
        }
    }

    private async createSwipe(
        swiperId: string,
        swipedId: string,
        isLike: boolean,
    ): Promise<void> {
        // Create a new swipe record
        await this.swipeRepository.insert({
            swiper_id: swiperId,
            swiped_id: swipedId,
            is_like: isLike,
        });
    }

    private async updateSwipeCounts(
        profile: Profile,
        isLike: boolean,
    ): Promise<void> {
        const updateFields: Partial<Profile> = {
            daily_swipe_count: profile.daily_swipe_count + 1,
            likes_count: isLike ? profile.likes_count + 1 : profile.likes_count,
        };

        await this.profileRepository.update({ id: profile.id }, updateFields);
    }

    private async getRandomProfile(
        userIds: string[],
        genderPreference: string,
        isPremiumVerified: boolean,
    ): Promise<Profile | null> {
        const randomProfile = await this.profileRepository
            .createQueryBuilder('profile')
            .where('profile.gender = :gender', { gender: genderPreference })
            .andWhere('profile.user_id NOT IN (:...userIds)', { userIds })
            .andWhere('profile.is_verified = :isVerified', {
                isVerified: isPremiumVerified,
            })
            .orderBy('RANDOM()')
            .getOne();

        return randomProfile;
    }

    private getGenderPreferences(gender: string): string {
        if (gender == 'male') {
            return 'female';
        }
        return 'male';
    }

    checkPremiums(premiums) {
        let isPremiumVerified = false;
        let isUnlimitedSwiped = false;

        for (const premium of premiums) {
            if (premium.package) {
                if (premium.package.name === 'verified_lable_view') {
                    isPremiumVerified = true;
                } else if (premium.package.name === 'unlimited_swipes') {
                    isUnlimitedSwiped = true;
                }
            }
        }

        return { isPremiumVerified, isUnlimitedSwiped };
    }
}
