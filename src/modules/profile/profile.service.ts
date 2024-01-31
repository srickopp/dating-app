import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../models/entities/profile.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
    ) {}

    async getProfile(userId: string): Promise<Profile> {
        const profile = await this.profileRepository.findOne({
            where: {
                user_id: userId, // Access nested 'user' alias for comparison
            },
            relations: ['premiums.package'],
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        return profile;
    }
}
