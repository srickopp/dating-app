import { Test, TestingModule } from '@nestjs/testing';
import { PremiumPackageService } from './premium-package.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PremiumPackage } from '../../models/entities/premium-package.entity';
import { UserPremium } from '../../models/entities/user-premium.entity';
import { Profile } from '../../models/entities/profile.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrderPremiumPackageDto } from './dto/order-package.dto';

describe('PremiumPackageService', () => {
    let premiumPackageService: PremiumPackageService;
    let profileRepository: jest.Mocked<Repository<Profile>>;
    let premiumPackageRepository: jest.Mocked<Repository<PremiumPackage>>;
    let userPremiumRepository: jest.Mocked<Repository<UserPremium>>;

    const mockProfile = {
        id: 'np',
        user_id: 'userId',
    } as Profile;

    const mockPremiumPackage = {
        id: 'premiumPackageId',
        name: 'Premium Package',
        total_purchased_user: 0,
    } as PremiumPackage;

    const mockUserPremium = {
        profile_id: 'profileId',
        package_id: 'premiumPackageId',
        start_date: new Date(),
        end_date: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
    } as UserPremium;

    const mockRepo = {
        findOne: jest.fn(),
        update: jest.fn(),
        find: jest.fn(),
        insert: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PremiumPackageService,
                {
                    provide: getRepositoryToken(Profile),
                    useValue: mockRepo,
                },
                {
                    provide: getRepositoryToken(PremiumPackage),
                    useValue: mockRepo,
                },
                {
                    provide: getRepositoryToken(UserPremium),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        premiumPackageService = module.get<PremiumPackageService>(
            PremiumPackageService,
        );
        profileRepository = module.get(getRepositoryToken(Profile));
        premiumPackageRepository = module.get(
            getRepositoryToken(PremiumPackage),
        );
        userPremiumRepository = module.get(getRepositoryToken(UserPremium));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('listPremiumPackage', () => {
        it('should list premium packages', async () => {
            jest.spyOn(premiumPackageRepository, 'find').mockResolvedValueOnce([
                mockPremiumPackage,
            ]);

            const result = await premiumPackageService.listPremiumPackage();

            expect(result.message).toBe('List Premium Package');
            expect(result.data).toEqual([mockPremiumPackage]);
        });
    });

    describe('orderPremiumPackage', () => {
        it('should order premium package successfully', async () => {
            const orderDto: OrderPremiumPackageDto = {
                package_id: 'premiumPackageId',
            };

            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockProfile,
            );

            jest.spyOn(userPremiumRepository, 'findOne').mockResolvedValueOnce(
                null,
            );

            jest.spyOn(
                premiumPackageRepository,
                'findOne',
            ).mockResolvedValueOnce(mockPremiumPackage);

            const result = await premiumPackageService.orderPremiumPackage(
                'userId',
                orderDto,
            );

            expect(result.message).toBe('Success Order Premium Package');
            expect(userPremiumRepository.insert).toHaveBeenCalledWith({
                profile_id: mockProfile.id,
                package_id: mockPremiumPackage.id,
                start_date: expect.any(Date),
                end_date: expect.any(Date),
            });
            expect(premiumPackageRepository.update).toHaveBeenCalledWith(
                { id: mockPremiumPackage.id },
                {
                    total_purchased_user:
                        mockPremiumPackage.total_purchased_user + 1,
                },
            );
        });

        it('should throw NotFoundException if premium package not found', async () => {
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockProfile,
            );
            jest.spyOn(
                premiumPackageRepository,
                'findOne',
            ).mockResolvedValueOnce(null);

            const orderDto: OrderPremiumPackageDto = {
                package_id: 'premiumPackageId',
            };

            await expect(
                premiumPackageService.orderPremiumPackage('userId', orderDto),
            ).rejects.toThrowError(NotFoundException);
        });

        it('should throw NotFoundException if premium package already purchased', async () => {
            jest.spyOn(profileRepository, 'findOne').mockResolvedValueOnce(
                mockProfile,
            );
            jest.spyOn(
                premiumPackageRepository,
                'findOne',
            ).mockResolvedValueOnce(mockPremiumPackage);
            jest.spyOn(userPremiumRepository, 'findOne').mockResolvedValueOnce(
                mockUserPremium,
            );

            const orderDto: OrderPremiumPackageDto = {
                package_id: 'premiumPackageId',
            };

            await expect(
                premiumPackageService.orderPremiumPackage('userId', orderDto),
            ).rejects.toThrowError(NotFoundException);
        });
    });
});
