import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Campaigns {
  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  subtitle: string;

  @Prop()
  thanks_message: string;

  @Prop()
  email_status: {
    type: string,
    enum: ['required', 'optional', 'hidden'],
    default: 'hidden'
  };

  @Prop()
  full_name_status: {
    type: string,
    enum: ['required', 'optional', 'hidden'],
    default: 'hidden'
  };

  @Prop()
  description_status: {
    type: string,
    enum: ['required', 'optional', 'hidden'],
    default: 'hidden'
  };

  @Prop()
  star_status: {
    type: string,
    enum: ['required', 'optional', 'hidden'],
    default: 'hidden'
  };

  @Prop()
  type: {
    type: string,
    enum: ['contact', 'feedback', 'subscribe']
  };

  @Prop()
  user_id: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}

export type CampaignsDocument = Campaigns & Document;

export const CampaignsSchema = SchemaFactory.createForClass(Campaigns);
