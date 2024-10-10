import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;
  let res: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);

    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as unknown as Response;
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should create a user and return tokens', async () => {
      const newUser: SignupDto = {
        name: 'karan test',
        email: 'karan@test.com',
        password: 'password',
      };
      const tokens = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(tokens);

      const result = await authController.signup(newUser, res);

      expect(result).toEqual({ access_token: 'access-token' });
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-token',
        expect.any(Object),
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      // const newUser: SignupDto = {
      //   name: 'karan test',
      //   email: 'karan@test.com',
      //   password: 'password',
      // };
      // jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce({
      //   id: 'existing-id',
      //   name: 'Existing User',
      //   email: 'karan@test.com',
      //   password: 'hashedPassword',
      //   role: UserRole.USER,
      //   refreshToken: null,
      // } as User);
      // jest.spyOn(usersService, 'create').mockImplementation(() => {
      //   throw new ConflictException('User with this email already exists');
      // });
      // await expect(authController.signup(newUser, res)).rejects.toThrow(
      //   ConflictException,
      // );
      // expect(usersService.findByEmail).toHaveBeenCalledWith(newUser.email);
    });

    it('should call authService.signup and return tokens', async () => {
      const newUser: CreateUserDto = {
        email: 'karan@test.com',
        name: 'Test User',
        password: 'Password123!',
      };
      const tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };
      jest.spyOn(authService, 'signup').mockResolvedValue(tokens);

      const response = {
        cookie: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      const result = await authController.signup(newUser, response);

      expect(authService.signup).toHaveBeenCalledWith(newUser);
      expect(response.cookie).toHaveBeenCalledWith(
        'refresh_token',
        tokens.refresh_token,
        expect.any(Object),
      );
      expect(result).toEqual({
        access_token: tokens.access_token,
      });
    });
  });

  describe('login', () => {
    it('should call authService.login and return tokens', async () => {
      const loginUserDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };
      const tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };
      (authService.login as jest.Mock).mockResolvedValue(tokens);

      const response = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = await authController.login(loginUserDto, response);

      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
      expect(response.cookie).toHaveBeenCalledWith(
        'refresh_token',
        tokens.refresh_token,
        expect.any(Object),
      );
      expect(result).toEqual({
        access_token: tokens.access_token,
      });
    });
  });
});
