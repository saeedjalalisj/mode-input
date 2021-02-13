import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Campaigns } from '../../campaign/entities/campaign.schema';
import { TrackingCode } from '../../tracking-code/entities/tracking-code.entity';

@Schema()
export class CampaignResponse {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Campaigns.name,
    required: true,
  })
  campId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: TrackingCode.name,
    required: true,
    unique: true,
  })
  trackingId: string;

  @Prop(String)
  email: string;

  @Prop(String)
  mobile: string;

  @Prop(String)
  full_name: string;

  @Prop(String)
  rate: string;

  @Prop(String)
  comment: string;

  @Prop(String)
  ip: string;

  @Prop(String)
  agent: string;

  @Prop(String)
  os_version: string;

  @Prop(String)
  device_name: string;

  @Prop([Number])
  location: [];

  @Prop(String)
  browser_name: string;

  @Prop(String)
  browser_version: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  created_at: Date;
}

export type CampaignResponseDocument = CampaignResponse & Document;

export const CampaignResponseSchema = SchemaFactory.createForClass(
  CampaignResponse,
);
