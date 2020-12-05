import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.schema';


//todo: add schema string validation
// validation: not working
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

  @Prop(String)
  email_status: string;

  @Prop(String)
  full_name_status: string

  @Prop(String)
  description_status:string

  @Prop(String)
  star_status: string;
  
  @Prop(String)
  type: string

  @Prop({
    type:  mongoose.Schema.Types.ObjectId,
    ref: User.name
  })
  userId: string
}

export type CampaignsDocument = Campaigns & Document;

export const CampaignsSchema = SchemaFactory.createForClass(Campaigns);
