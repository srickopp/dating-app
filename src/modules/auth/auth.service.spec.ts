// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/entities/user.entity';
import { Profile } from '../../models/entities/profile.entity';
import { UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';

jest.mock('bcrypt');

const mockUser = {
    id: '1',
    email: 'test@example.com',
    password_hash: 'hashedPassword',
    username: 'testuser',
    created_at: new Date(),
    updated_at: new Date(),
} as User;

// const mockProfile = {
//     id: '1',
//     user_id: 'user-1',
//     name: 'John Doe',
//     age: 25,
//     daily_swipe_count: 10,
//     likes_count: 5,
//     gender: 'male',
//     bio: 'A brief bio about me.',
//     image_url: 'https://example.com/avatar.jpg',
//     is_verified: true,
//     created_at: new Date(),
//     updated_at: new Date(),
// } as Profile;

describe('AuthService', () => {
    let service: AuthService;
    let userRepositoryMock: jest.Mocked<Repository<User>>;
    let profileRepositoryMock: jest.Mocked<Repository<Profile>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Profile),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
            imports: [
                JwtModule.register({
                    secret: 'test',
                }),
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepositoryMock = module.get(getRepositoryToken(User));
        profileRepositoryMock = module.get(getRepositoryToken(Profile));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('login', () => {
        it('should return an access token if login is successful', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password',
            };

            userRepositoryMock.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockReturnValueOnce(true);
            const jwtSignSpy = jest.spyOn(service['jwtService'], 'sign');

            const result = await service.login(loginDto);

            expect(result.accessToken).toBeDefined();
            expect(jwtSignSpy).toHaveBeenCalledWith({
                sub: mockUser.id,
                email: mockUser.email,
            });
        });

        it('should throw UnauthorizedException if login fails', async () => {
            const loginDto = {
                email: 'test@example.com',
                password: 'password',
            };

            userRepositoryMock.findOne.mockReturnValueOnce(undefined);

            await expect(service.login(loginDto)).rejects.toThrowError(
                UnauthorizedException,
            );
        });
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'password',
                username: 'testuser',
                name: 'John Doe',
                age: 25,
                gender: 'male',
                bio: 'A brief bio',
                image_url: 'https://example.com/avatar.jpg',
            };

            userRepositoryMock.findOne.mockReturnValueOnce(undefined);
            userRepositoryMock.create.mockReturnValueOnce({
                email: registerDto.email,
                username: registerDto.username,
                password_hash: '',
            } as User);
            const saveSpy = jest.spyOn(userRepositoryMock, 'save');
            const saveProfileSpy = jest.spyOn(profileRepositoryMock, 'save');
            const result = await service.register(registerDto);

            expect(result.message).toEqual('User registered successfully');
            expect(saveSpy).toHaveBeenCalled();
            expect(saveProfileSpy).toHaveBeenCalled();
        });

        it('should throw UnauthorizedException if the email is already registered', async () => {
            const registerDto = {
                email: 'test@example.com',
                password: 'password',
                username: 'testuser',
                name: 'John Doe',
                age: 25,
                gender: 'male',
                bio: 'A brief bio',
                image_url: 'https://example.com/avatar.jpg',
            };

            userRepositoryMock.findOne.mockResolvedValue(mockUser);

            await expect(service.register(registerDto)).rejects.toThrowError(
                UnauthorizedException,
            );
        });
    });
});
