import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TrackingCode {
  @Prop(String)
  code: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createAt: Date;
}

export type TrackingCodeDocument = TrackingCode & Document;

export const TrackingCodeSchema = SchemaFactory.createForClass(TrackingCode);
