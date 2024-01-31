// swipe.controller.ts

import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SwipeService } from './swipe.service';
import { SwipeDto } from './dto/swipe.dto';

@UseGuards(JwtAuthGuard)
@Controller('swipe')
export class SwipeController {
    constructor(private readonly swipeService: SwipeService) {}

    @Get('/new-match')
    async newMatchProfile(@Req() req: any, @Res() res: Response): Promise<any> {
        const userId = req.user.id;
        try {
            const profile = await this.swipeService.getNewMatchProfile(userId);
            return res.status(HttpStatus.OK).send({
                message: 'Get Match Profile',
                data: profile,
            });
        } catch (error) {
            return res.status(error.getStatus()).send({
                message: error.message,
                data: null,
            });
        }
    }

    @Post('/swipe')
    async swipeProfile(
        @Req() req: any,
        @Res() res: Response,
        @Body() swipeDto: SwipeDto,
    ): Promise<any> {
        const userId = req.user.id;
        const { swipedId, action } = swipeDto;

        try {
            const result = await this.swipeService.processSwipeAction(
                userId,
                swipedId,
                action,
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
