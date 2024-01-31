import { Test, TestingModule } from '@nestjs/testing';
import { PremiumPackageService } from './premium-package.service';

describe('PremiumPackageService', () => {
    let service: PremiumPackageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PremiumPackageService],
        }).compile();

        service = module.get<PremiumPackageService>(PremiumPackageService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
