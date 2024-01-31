import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../../models/entities/profile.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProfileService', () => {
    let service: ProfileService;
    let profileRepository: jest.Mocked<Repository<Profile>>;

    const mockRepo = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        insert: jest.fn(),
        update: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProfileService,
                {
                    provide: getRepositoryToken(Profile),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get<ProfileService>(ProfileService);
        profileRepository = module.get(getRepositoryToken(Profile));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProfile', () => {
        it('should return a profile if it exists', async () => {
            const mockProfile = { user_id: 'userId' } as Profile;
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockProfile,
            );

            const result = await service.getProfile('userId');

            expect(result).toEqual(mockProfile);
        });

        it('should throw NotFoundException if profile does not exist', async () => {
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                undefined,
            );

            await expect(
                service.getProfile('nonExistentUserId'),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
