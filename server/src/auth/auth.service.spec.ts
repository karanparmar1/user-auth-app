import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { SECRETS } from '../common/constants';
import { UserRole } from '../common/interfaces/enums';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  // eslint-disable-next-line
  let jwtService: JwtService;

  beforeEach(async () => {
    const UsersServiceMock = {
      findByEmail: jest.fn().mockResolvedValue({
        email: 'karan@test.com',
        password: 'hashed-passworddd',
        role: UserRole.USER,
      }),
      findById: jest.fn(),
      create: jest.fn(),
      setRefreshToken: jest.fn(),
    };

    // const UserModelMock = {
    //   new: jest.fn().mockResolvedValue({
    //     email: 'karan@test.com',
    //     role: UserRole.USER,
    //     password: 'hashed-passworddd',
    //     _id: 'mocked-user-id',
    //   }),
    //   save: jest.fn().mockResolvedValue({
    //     email: 'karan@test.com',
    //     role: UserRole.USER,
    //     password: 'hashed-passworddd',
    //     _id: 'mocked-user-id',
    //   }),
    // };

    const JwtServiceMock = {
      signAsync: jest.fn(),
      sign: jest.fn().mockReturnValue('some-jwt-token'),
      verify: jest.fn().mockReturnValue({ email: 'karan@test.com' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: UsersServiceMock },
        { provide: JwtService, useValue: JwtServiceMock },
        // { provide: getModelToken(User.name), useValue: UserModelMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should throw an error when signing up with an existing email', async () => {
      jest.spyOn(usersService, 'create').mockImplementation(() => {
        throw new ConflictException();
      });

      const existingUser = {
        email: 'karan@test.com',
        name: 'karan test',
        password: 'password123',
      };

      try {
        await authService.signup(existingUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Email already in use');
      }
    });

    it('should throw BadRequestException when email is already in use', async () => {
      const newUser = {
        email: 'karan@test.com',
        name: 'karan',
        password: 'password123',
      };
      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new ConflictException('Email already in use'));

      try {
        await authService.signup(newUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Email already in use');
        expect(usersService.create).toHaveBeenCalledWith(newUser);
      }
    });

    it('should not generate tokens when BadRequestException is thrown', async () => {
      const mockJwtService = { sign: jest.fn().mockReturnValue('token') };

      const newUser = {
        name: 'karan',
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(usersService, 'create')
        .mockResolvedValue({ ...newUser, role: UserRole.USER } as User);

      jest
        .spyOn(usersService, 'create')
        .mockRejectedValue(new ConflictException('Email already in use'));

      try {
        await authService.signup(newUser);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Email already in use');
        expect(usersService.create).toHaveBeenCalledWith(newUser);
        expect(mockJwtService.sign).not.toHaveBeenCalled();
      }
    });

    it('should create new user and return tokens if user does not exist', async () => {
      const newUser: SignupDto = {
        name: 'karan test',
        email: 'karan@test.com',
        password: 'password123',
      };

      const savedUser = {
        ...newUser,
        id: 'userId',
      } as User;

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);

      jest.spyOn(usersService, 'create').mockResolvedValueOnce(savedUser);

      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('access_token');
      jest.spyOn(jwtService, 'sign').mockReturnValue('refresh_token');

      const result = await authService.signup(newUser);

      expect(result).toEqual({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });

      expect(usersService.create).toHaveBeenCalledWith(newUser);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { email: newUser.email, sub: savedUser.id },
        { secret: SECRETS.JWT_SECRET, expiresIn: SECRETS.JWT_EXPIRATION },
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        { email: newUser.email, sub: savedUser.id },
        {
          secret: SECRETS.REFRESH_TOKEN_SECRET,
          expiresIn: SECRETS.REFRESH_TOKEN_EXPIRATION,
        },
      );
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid email', async () => {
      const loginUser: LoginDto = {
        email: 'invalid@example.com',
        password: 'password123!',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);

      await expect(authService.login(loginUser)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginUser.email);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginUser: LoginDto = {
        email: 'karan@test.com',
        password: 'wrongPassword',
      };

      const existingUser = {
        email: 'karan@test.com',
        password: 'hashedPassword',
      } as User;

      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(existingUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValueOnce(false);

      await expect(authService.login(loginUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return access and refresh tokens for valid login', async () => {
      const loginUser: LoginDto = {
        email: 'karan@test.com',
        password: 'password123',
      };

      const existingUser = {
        id: 'userId',
        email: 'johndoe@example.com',
        password: 'hashedPassword',
      } as User;

      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValueOnce(existingUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValueOnce(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('access_token');
      jest.spyOn(jwtService, 'sign').mockReturnValue('refresh_token');

      const result = await authService.login(loginUser);

      expect(result).toEqual({
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginUser.email);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginUser.password,
        existingUser.password,
      );

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { email: existingUser.email, sub: existingUser.id },
        { secret: SECRETS.JWT_SECRET, expiresIn: SECRETS.JWT_EXPIRATION },
      );

      expect(jwtService.sign).toHaveBeenCalledWith(
        { email: existingUser.email, sub: existingUser.id },
        {
          secret: SECRETS.REFRESH_TOKEN_SECRET,
          expiresIn: SECRETS.REFRESH_TOKEN_EXPIRATION,
        },
      );
    });
  });

  describe('refreshToken', () => {
    it('should throw UnauthorizedException for invalid refresh token', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken('invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should generate new tokens for valid refresh token', async () => {
      const user = {
        id: 'userId',
        email: 'johndoe@example.com',
        refreshToken: 'validRefreshToken',
      } as User;

      jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 'userId' });
      jest.spyOn(usersService, 'findById').mockResolvedValueOnce(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('accessToken');

      const result = await authService.refreshToken('validRefreshToken');

      expect(result).toEqual({
        access_token: 'accessToken',
        refresh_token: expect.any(String),
      });
    });
  });

  describe('logout', () => {
    it('should clear the refresh token for the user', async () => {
      jest.spyOn(usersService, 'setRefreshToken').mockResolvedValueOnce();

      await authService.logout('userId');

      expect(usersService.setRefreshToken).toHaveBeenCalledWith('userId', null);
    });
  });
});
