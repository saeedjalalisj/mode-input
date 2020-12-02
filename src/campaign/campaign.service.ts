import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaigns, CampaignsDocument } from './entities/campaign.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CampaignService {
  constructor(@InjectModel(Campaigns.name) private campaignModel: Model<CampaignsDocument>) {
  }

  async create(createCampaignDto: CreateCampaignDto) {
    try {
      return await new this.campaignModel(createCampaignDto).save();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(page: number, perPage = 5) {
    try {
      page = (page - 1) > 0 ? (page - 1) : 0;
      return await this.campaignModel.find().limit(perPage).skip(perPage * page).exec();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      return await this.campaignModel.findOne({ _id: id });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto) {
    try { // todo: remove ts-list problem
      return await this.campaignModel.updateOne({ _id: id }, {
        $set: updateCampaignDto,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }
}
