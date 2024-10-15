import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SECRETS } from '../common/constants';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid Email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async signup(newUser: SignupDto) {
    try {
      const createdUser = await this.usersService.create(newUser);

      const tokens = await this.generateTokens(createdUser);
      return tokens;
    } catch (error) {
      console.log('caught error', { msg: error });
      if (error instanceof ConflictException) {
        throw new BadRequestException('Email already in use');
      }
      throw error;
    }
  }

  async login(loginUser: LoginDto) {
    const user = await this.validateUser(loginUser.email, loginUser.password);

    const tokens = await this.generateTokens(user);
    return tokens;
  }

  private async generateTokens(user: User) {
    const payload = { email: user.email, sub: user._id };

    // const access_token = this.jwtService.sign(payload);
    const access_token = await this.jwtService.signAsync(payload, {
      secret: SECRETS.JWT_SECRET,
      expiresIn: SECRETS.JWT_EXPIRATION,
    });
    const refresh_token = this.jwtService.sign(payload, {
      secret: SECRETS.REFRESH_TOKEN_SECRET,
      expiresIn: SECRETS.REFRESH_TOKEN_EXPIRATION,
    });

    await this.usersService.setRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: SECRETS.REFRESH_TOKEN_SECRET,
      });
      const user = await this.usersService.findById(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid refresh token : ',
        error.message,
      );
    }
  }

  async logout(userId: string) {
    await this.usersService.setRefreshToken(userId, null);
  }
}
