import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { REGEX } from '../../common/constants';
import { UserRole } from '../../common/interfaces/enums';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(REGEX.PASSWORD, { message: 'Password too weak' })
  password: string;

  @IsEnum(UserRole, { message: 'Invalid user role' })
  @IsOptional()
  @Transform(({ value }) => value || UserRole.USER) // If 'role' is missing, default to USER
  role?: UserRole;
}
