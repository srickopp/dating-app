import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Profile } from '../../models/entities/profile.entity';
import { Swipe } from 'src/models/entities/swipe.entity';
import * as moment from 'moment';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        @InjectRepository(Swipe)
        private readonly swipeRepository: Repository<Swipe>,
    ) {}

    async getProfile(userId: string): Promise<Profile> {
        const profile = await this.profileRepository.findOne({
            where: {
                user_id: userId,
            },
        });
        return profile;
    }

    async newMatchProfile(userId: string): Promise<Profile> {
        const profile = await this.profileRepository.findOne({
            where: {
                user_id: userId,
            },
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        if (profile.daily_swipe_count >= 10) {
            // User has reached the daily swipe limit
            throw new BadRequestException("You've reached your daily limit");
        }

        const userIds = [userId];
        const maxAttempts = 10;
        let attempts = 0;

        while (attempts < maxAttempts) {
            const randomProfile = await this.getRandomProfile(
                userIds,
                this.getGenderPreferences(profile.gender),
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

    private async getRandomProfile(
        userIds: string[],
        genderPreference: string,
    ): Promise<Profile | null> {
        // Fetch random profile based on gender preference
        const randomProfile = await this.profileRepository
            .createQueryBuilder('profile')
            .where('profile.gender = :gender', { gender: genderPreference })
            .andWhere('profile.user_id NOT IN (:...userIds)', { userIds })
            .orderBy('RANDOM()') // Fetch a random profile
            .getOne();

        return randomProfile;
    }

    private getGenderPreferences(gender: string): string {
        if (gender == 'male') {
            return 'female';
        }
        return 'male';
    }
}
