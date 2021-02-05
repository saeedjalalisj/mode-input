import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  family: string;

  @Prop()
  roles: [string];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  // https://stackoverflow.com/questions/37365038/this-is-undefined-in-a-mongoose-pre-save-hook
  // @ts-ignore
  this.password = await bcrypt.hash(String(this.password) , 10) // todo : get salt from config
  // @ts-ignore
  this.roles = ['user'];
  next();
});
