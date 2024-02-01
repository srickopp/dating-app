import { Test, TestingModule } from '@nestjs/testing';
import { SwipeService } from './swipe.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../../models/entities/profile.entity';
import { Swipe } from '../../models/entities/swipe.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SwipeService', () => {
    let swipeService: SwipeService;
    let profileRepository: jest.Mocked<Repository<Profile>>;
    let swipeRepository: jest.Mocked<Repository<Swipe>>;
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
                SwipeService,
                {
                    provide: getRepositoryToken(Profile),
                    useValue: mockRepo,
                },
                {
                    provide: getRepositoryToken(Swipe),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        swipeService = module.get<SwipeService>(SwipeService);
        profileRepository = module.get(getRepositoryToken(Profile));
        swipeRepository = module.get(getRepositoryToken(Swipe));
    });

    describe('getNewMatchProfile', () => {
        it('should throw NotFoundException if profile not found', async () => {
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                undefined,
            );

            await expect(
                swipeService.getNewMatchProfile('userId'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if daily swipe limit is reached', async () => {
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce({
                daily_swipe_count: 10,
            } as Profile);

            await expect(
                swipeService.getNewMatchProfile('userId'),
            ).rejects.toThrow(BadRequestException);
        });

        it('should return a profile if conditions are met', async () => {
            const mockProfile = {
                user_id: 'userId',
                daily_swipe_count: 5,
            } as Profile;
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockProfile,
            );
            jest.spyOn(
                swipeService as any,
                'getRandomProfile',
            ).mockResolvedValueOnce(mockProfile);

            const result = await swipeService.getNewMatchProfile('userId');

            expect(result).toEqual(mockProfile);
        });

        it('should throw BadRequestException if unlimited swipes not verified', async () => {
            const mockProfile = {
                user_id: 'userId',
                daily_swipe_count: 5,
                premiums: [
                    {
                        package: {
                            name: 'verified_label_view',
                        },
                    },
                ],
            } as Profile;

            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockProfile,
            );

            jest.spyOn(
                swipeService as any,
                'getRandomProfile',
            ).mockResolvedValueOnce(null);

            await expect(
                swipeService.getNewMatchProfile('userId'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should return a profile if conditions are met', async () => {
            const mockProfile = {
                user_id: 'userId',
                daily_swipe_count: 11,
                premiums: [
                    {
                        package: {
                            name: 'unlimited_swipes',
                        },
                    },
                ],
            } as Profile;

            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockProfile,
            );
            jest.spyOn(
                swipeService as any,
                'getRandomProfile',
            ).mockResolvedValueOnce(mockProfile);

            const result = await swipeService.getNewMatchProfile('userId');

            expect(result).toEqual(mockProfile);
        });
    });

    describe('processSwipeAction', () => {
        it('should call likeProfile for action = like', async () => {
            const spyLikeProfile = jest
                .spyOn(swipeService, 'likeProfile')
                .mockResolvedValueOnce(null);

            await swipeService.processSwipeAction('userId', 'swipedId', 'like');

            expect(spyLikeProfile).toHaveBeenCalledWith('userId', 'swipedId');
        });

        it('should call passProfile for action = pass', async () => {
            const spyPassProfile = jest
                .spyOn(swipeService, 'passProfile')
                .mockResolvedValueOnce(null);

            await swipeService.processSwipeAction('userId', 'swipedId', 'pass');

            expect(spyPassProfile).toHaveBeenCalledWith('userId', 'swipedId');
        });
    });

    describe('likeProfile', () => {
        it('should throw NotFoundException if profiles not found', async () => {
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                undefined,
            );

            await expect(
                swipeService.likeProfile('swiperId', 'swipedId'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if swiped profile not found', async () => {
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                {} as Profile,
            );
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                undefined,
            );

            await expect(
                swipeService.likeProfile('swiperId', 'swipedId'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should return matched profiles if a match occurs', async () => {
            const mockSwiperProfile = { user_id: 'swiperId' } as Profile;
            const mockSwipedProfile = { id: 'swipedId' } as Profile;
            const mockIsMatch = { is_like: true } as Swipe;
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockSwiperProfile,
            );
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockSwipedProfile,
            );
            jest.spyOn(swipeRepository, 'findOne').mockResolvedValueOnce(
                mockIsMatch,
            );

            const result = await swipeService.likeProfile(
                'swiperId',
                'swipedId',
            );

            expect(result).toEqual({
                message: 'Matched!',
                profile: mockSwiperProfile,
                match_profile: mockSwipedProfile,
            });
        });

        it('should return continue searching if no match occurs', async () => {
            const mockSwiperProfile = { user_id: 'swiperId' } as Profile;
            const mockSwipedProfile = { id: 'swipedId' } as Profile;
            const mockIsMatch = undefined;
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockSwiperProfile,
            );
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockSwipedProfile,
            );
            jest.spyOn(swipeRepository, 'findOne').mockResolvedValueOnce(
                mockIsMatch,
            );

            const result = await swipeService.likeProfile(
                'swiperId',
                'swipedId',
            );

            expect(result).toEqual({
                message: 'Continue searching',
                profile: mockSwiperProfile,
            });
        });
    });

    describe('passProfile', () => {
        it('should throw NotFoundException if profiles not found', async () => {
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                undefined,
            );

            await expect(
                swipeService.passProfile('swiperId', 'swipedId'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if swiped profile not found', async () => {
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                {} as Profile,
            );
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                undefined,
            );

            await expect(
                swipeService.passProfile('swiperId', 'swipedId'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should return continue searching', async () => {
            const mockSwiperProfile = { user_id: 'swiperId' } as Profile;
            const mockSwipedProfile = { id: 'swipedId' } as Profile;
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockSwiperProfile,
            );
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockSwipedProfile,
            );

            const result = await swipeService.passProfile(
                'swiperId',
                'swipedId',
            );

            expect(result).toEqual({
                message: 'Continue searching',
                profile: mockSwiperProfile,
            });
        });
    });
});
