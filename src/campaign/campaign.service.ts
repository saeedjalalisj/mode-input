import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaigns, CampaignsDocument } from './entities/campaign.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCampaignInterface } from './interface/createCampaign.interface';

@Injectable()
export class CampaignService {
  constructor(@InjectModel(Campaigns.name) private campaignModel: Model<CampaignsDocument>) {
  }

  async create(createCampaign: CreateCampaignInterface, userId: string) {
    try {
      createCampaign.userId = userId;
      return await new this.campaignModel(createCampaign).save();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(page: number, perPage = 5, userId: string) {
    try {
      page = (page - 1) > 0 ? (page - 1) : 0;
      perPage = perPage * 1;
      return await this.campaignModel.find({userId}).limit(perPage).skip(perPage * page).exec();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string, userId: string) {
    try {
      return await this.campaignModel.findOne({ _id: id, userId });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto, userId: string) {
    try { // todo: remove ts-list problem
      return await this.campaignModel.updateOne({ _id: id, userId }, {
        $set: updateCampaignDto,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: string, userId: string) {
    return `This action removes a #${id} campaign`;
  }
}
