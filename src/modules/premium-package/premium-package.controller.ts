import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Res,
    HttpStatus,
    Get,
} from '@nestjs/common';
import { OrderPremiumPackageDto } from './dto/order-package.dto';
import { PremiumPackageService } from './premium-package.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('premium-package')
export class PremiumPackageController {
    constructor(
        private readonly premiumPackageService: PremiumPackageService,
    ) {}

    @Get()
    async getPremiumPackages(@Res() res: Response) {
        const result = await this.premiumPackageService.listPremiumPackage();
        return res.status(HttpStatus.OK).send(result);
    }

    @Post('/order')
    async orderPremiumPackage(
        @Req() req: any,
        @Res() res: Response,
        @Body() orderDto: OrderPremiumPackageDto,
    ): Promise<any> {
        const userId = req.user.id;
        try {
            const result = await this.premiumPackageService.orderPremiumPackage(
                userId,
                orderDto,
            );
            return res.status(HttpStatus.OK).send(result);
        } catch (error) {
            return res.status(error.getStatus()).send({
                message: error.message,
                data: null,
            });
        }
    }
}
