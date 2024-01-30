import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Profile } from '../../models/entities/profile.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
    ) {}

    async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (
            !user ||
            !(await this.comparePasswords(password, user.password_hash))
        ) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { id: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }

    async register(
        registerDto: RegisterDto,
    ): Promise<{ message: string; profile?: Profile }> {
        const { email, password, username, name, age, gender, bio, image_url } =
            registerDto;

        const existingUser = await this.userRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new UnauthorizedException('Email is already registered');
        }

        const newUser = this.userRepository.create({ email, username });
        newUser.password_hash = await this.hashPassword(password);
        await this.userRepository.save(newUser);

        // Create a new profile
        const newProfile = await this.profileRepository.save({
            user_id: newUser.id,
            name,
            age,
            gender,
            bio,
            image_url,
        });

        return { message: 'User registered successfully', profile: newProfile };
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    private async comparePasswords(
        candidatePassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }
}
