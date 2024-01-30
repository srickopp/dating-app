import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
        @Res() res: Response,
    ): Promise<void> {
        try {
            const result = await this.authService.register(registerDto);
            res.status(HttpStatus.CREATED).send(result);
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.BAD_REQUEST).send({
                message: error.message,
                data: null,
            });
        }
    }

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res() res: Response,
    ): Promise<void> {
        try {
            const result = await this.authService.login(loginDto);
            res.status(HttpStatus.OK).send({
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.UNAUTHORIZED).send({
                message: 'Invalid credentials',
                data: null,
            });
        }
    }
}
