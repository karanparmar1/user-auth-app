import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SignupDto extends OmitType(CreateUserDto, ['role'] as const) {}
