import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  family: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async (next) => {
  this.password = await bcrypt.hash(this.password , 10) // todo : get salt from config
  next();
});
