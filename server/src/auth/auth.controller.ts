import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { SERVER_CONFIG } from '../common/constants';
import { DaysToMS } from '../common/utils';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() newUser: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signup(newUser);

    this.setRefreshTokenCookie(res, tokens.refresh_token);

    return { access_token: tokens.access_token };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUser: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.login(loginUser);

    this.setRefreshTokenCookie(res, refresh_token);

    return { access_token };
  }

  // get the current user's profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  // @Csrf()
  async getProfile(@Req() req) {
    const { userId } = req.user;
    const user = await this.usersService.findById(userId);

    if (user) {
      const { password, refreshToken, ...result } = user;
      return result;
    }
    return null;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    const { access_token, refresh_token } =
      await this.authService.refreshToken(refreshToken);

    this.setRefreshTokenCookie(res, refresh_token);

    return { access_token };
  }

  @Get('csrf')
  getCsrfToken(@Req() req): any {
    return {
      token: req.csrfToken(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user?.userId);

    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // SERVER_CONFIG.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: DaysToMS(7),
    });
  }
}
