import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TrackingCode,
  TrackingCodeDocument,
} from './entities/tracking-code.entity';

@Injectable()
export class TrackingCodeService {
  constructor(
    @InjectModel(TrackingCode.name)
    private trackingCodeModel: Model<TrackingCodeDocument>,
  ) {}

  async create(): Promise< TrackingCode> {
    try {
      const code: string = uuid();
      return await new this.trackingCodeModel({ code }).save();
    } catch (err) {
      throw new err();
    }
  }
}
