import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/entities/user.schema';

@Schema()
export class Site extends Document {

  @Prop(String)
  name: string;

  @Prop(String)
  url: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  userId: string;
}

export type SiteDocument = Site & Document;

export const SiteSchema = SchemaFactory.createForClass(Site);
