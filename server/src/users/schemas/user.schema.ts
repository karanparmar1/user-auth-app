import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { REGEX } from '../../common/constants';
import { UserRole } from '../../common/interfaces/enums';

@Schema({ timestamps: true })
export class User  extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, match: REGEX.EMAIL })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: null })
  refreshToken: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
