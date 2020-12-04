import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.schema';

@Schema()
export class Campaigns {
  @Prop(String)
  name: string;

  @Prop(String)
  title: string;

  @Prop(String)
  subtitle: string;

  @Prop(String)
  thanks_message: string;

  @Prop({
    type: String,
    enum: ['required', 'optional', 'hidden'],
  })
  email_status: string;

  @Prop({
    type: String,
    enum: ['required', 'optional', 'hidden'],
  })
  full_name_status: string

  @Prop({
    type: String,
    enum: ['required', 'optional', 'hidden'],
  })
  description_status:string

  @Prop({
    type: String,
    enum: ['required', 'optional', 'hidden'],
  })
  star_status: string;

  @Prop({
    type: String,
    enum: ['required', 'optional', 'hidden'],
  })
  type: string

  @Prop({
    type:  mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
  userId: string
}

export type CampaignsDocument = Campaigns & Document;

export const CampaignsSchema = SchemaFactory.createForClass(Campaigns);
