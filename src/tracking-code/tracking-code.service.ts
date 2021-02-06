import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrackingCode, TrackingCodeDocument } from './entities/tracking-code.entity';

@Injectable()
export class TrackingCodeService {
  constructor(@InjectModel(TrackingCode.name) private trackingCodeModel: Model<TrackingCodeDocument>) {}

  async create(): Promise<{ trackingCode: string }> {
    try {
      const code: string = uuid();
      const tracingCode = await new this.trackingCodeModel({ code }).save();
      return {
        trackingCode: tracingCode.code,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} trackingCode`;
  }
}
