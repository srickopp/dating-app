import { IsUUID } from 'class-validator';

export class OrderPremiumPackageDto {
    @IsUUID()
    package_id: string;
}
