import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.schema';
import { Site } from '../../site/entities/site.entity';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Campaigns {
  @ApiProperty()
  @Prop(String)
  name: string;

  @ApiProperty()
  @Prop(String)
  type: string;

  @ApiProperty()
  @Prop(String)
  title: string;

  @ApiProperty()
  @Prop(String)
  subtitle: string;

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  allow_rating: boolean;

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  require_rating: boolean;

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  allow_full_name: boolean;

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  require_full_name: boolean;

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  allow_email: boolean;

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  require_email: boolean;

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  allow_mobile: boolean;

  @ApiProperty()
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

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  require_comment: boolean;

  @ApiProperty()
  @Prop(String)
  thanks_message: string;

  @ApiProperty()
  @Prop({
    type: Boolean,
    default: false,
  })
  show_thanks_message: boolean;

  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: string;

  @ApiProperty()
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Site.name,
  })
  siteId: string;
}

export type CampaignsDocument = Campaigns & Document;

export const CampaignsSchema = SchemaFactory.createForClass(Campaigns);
