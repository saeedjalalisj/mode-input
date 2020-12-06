import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Campaigns } from '../../campaign/entities/campaign.schema';

@Schema()
export class CampaignResponse {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Campaigns.name
  })
  campId: string;

  @Prop(String)
  email: string;

  @Prop(String)
  full_name: string;

  @Prop(String)
  star: string;

  @Prop(String)
  description: string;

  @Prop(String)
  ip: string;

  @Prop(String)
  agent: string;
}

export type CampaignResponseDocument = CampaignResponse & Document;

export const CampaignResponseSchema = SchemaFactory.createForClass(CampaignResponse);
