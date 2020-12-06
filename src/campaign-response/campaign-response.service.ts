import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCampaignResponseInterface } from './interface/create-campaign-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CampaignResponse,
  CampaignResponseDocument,
} from './entities/campaign-response.schema';

@Injectable()
export class CampaignResponseService {
  constructor(@InjectModel(CampaignResponse.name) private campaignResponseModel: Model<CampaignResponseDocument>) {}

  async create(createCampaignResponseDto: CreateCampaignResponseInterface) {
    try {
      return await new this.campaignResponseModel(createCampaignResponseDto).save();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(campId: string, userId: string, page?: number, perPage?: number) {
    try {
      perPage = (perPage) ? perPage : 5;
      page = (page - 1) > 0 ? (page - 1) : 0;
      return await this.campaignResponseModel.find({ campId }).populate({
        path: 'campId',
        match: { userId }
      }).limit(perPage).skip(perPage * page).exec()
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: string) {
    try {
      return this.campaignResponseModel.findOne({_id: id}).exec();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
