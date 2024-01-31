import {
    Controller,
    Get,
    UseGuards,
    Req,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { Response } from 'express';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async viewProfile(@Req() req: any, @Res() res: Response): Promise<any> {
        const userId = req.user.id;
        try {
            const profile = await this.profileService.getProfile(userId);
            return res.status(HttpStatus.OK).send({
                message: 'User Profile',
                data: profile,
            });
        } catch (error) {
            return { error: error.message };
        }
    }
}
