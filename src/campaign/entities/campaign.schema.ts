import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.schema';

@Schema()
export class Campaigns {
  @Prop(String)
  name: string;

  @Prop(String)
  type: string;

  @Prop(String)
  title: string;

  @Prop(String)
  subtitle: string;

  @Prop(Boolean)
  allow_rating: boolean;

  @Prop(Boolean)
  require_rating: boolean;

  @Prop(Boolean)
  allow_full_name: boolean;

  @Prop(Boolean)
  require_full_name: boolean;

  @Prop(Boolean)
  allow_email: boolean;

  @Prop(Boolean)
  require_email: boolean;

  @Prop(Boolean)
  allow_mobile: boolean;

  @Prop(Boolean)
  require_mobile: boolean;

  @Prop(Boolean)
  allow_comment: boolean;

  @Prop(Boolean)
  require_comment: boolean;

  @Prop(String)
  thanks_message: string;

  @Prop(Boolean)
  show_thanks_message: boolean;

  @Prop({
    type:  mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
  userId: string;
}

export type CampaignsDocument = Campaigns & Document;

export const CampaignsSchema = SchemaFactory.createForClass(Campaigns);
