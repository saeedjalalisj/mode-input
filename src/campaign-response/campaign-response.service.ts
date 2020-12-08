import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCampaignResponseInterface } from './interface/create-campaign-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CampaignResponse,
  CampaignResponseDocument,
} from './entities/campaign-response.schema';
import { Campaigns } from '../campaign/entities/campaign.schema';

@Injectable()
export class CampaignResponseService {
  constructor(
    @InjectModel(CampaignResponse.name) private campaignResponseModel: Model<CampaignResponseDocument>) {}

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
      //todo: fix it (join not working)
      const response = await this.campaignResponseModel.find({ campId })
        .populate('campId', 'name, _id', Campaigns.name, {userId: userId})
        .limit(perPage).skip(perPage * page)
        .exec();
      return response.filter(res => res.campId !== null);
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
