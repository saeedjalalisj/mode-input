import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.schema';
import { Site } from '../../site/entities/site.entity';

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

  @Prop({
    type: Boolean,
    default: false,
  })
  allow_rating: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  require_rating: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  allow_full_name: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  require_full_name: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  allow_email: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  require_email: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  allow_mobile: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  require_mobile: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  allow_comment: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  require_comment: boolean;

  @Prop(String)
  thanks_message: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  show_thanks_message: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Site.name,
  })
  siteId: string;
}

export type CampaignsDocument = Campaigns & Document;

export const CampaignsSchema = SchemaFactory.createForClass(Campaigns);
