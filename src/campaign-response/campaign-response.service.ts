import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCampaignResponseInterface } from './interface/create-campaign-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CampaignResponse,
  CampaignResponseDocument,
} from './entities/campaign-response.schema';
import {
  Campaigns,
  CampaignsDocument,
} from '../campaign/entities/campaign.schema';
import { StatusCampaignResponseDto } from './dto/status-campaign-response.dto';
import { SendError } from '../shared/sendError';

@Injectable()
export class CampaignResponseService {
  constructor(
    @InjectModel(CampaignResponse.name)
    private campaignResponseModel: Model<CampaignResponseDocument>,
    @InjectModel(Campaigns.name)
    private campaignModel: Model<CampaignsDocument>,
  ) {}

  async create(createCampaignResponseDto: CreateCampaignResponseInterface) {
    try {
      return await new this.campaignResponseModel(
        createCampaignResponseDto,
      ).save();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(
    campId: string,
    userId: string,
    page?: number,
    perPage?: number,
  ) {
    try {
      perPage = perPage ? perPage : 5;
      page = page - 1 > 0 ? page - 1 : 0;
      //todo: fix it (join not working)
      const response = await this.campaignResponseModel
        .find({ campId })
        .populate('campId', 'name, _id', Campaigns.name, { userId: userId })
        .limit(perPage)
        .skip(perPage * page)
        .exec();
      return response.filter(res => res.campId !== null);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: string) {
    try {
      return this.campaignResponseModel.findOne({ _id: id }).exec();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async status(statusSiteDto: StatusCampaignResponseDto) {
    try {
      const campaignResponse = await this.campaignResponseModel.aggregate([
        {
          $lookup: {
            from: 'trackingcodes',
            as: 'tracking',
            pipeline: [
              {
                $match: {
                  $expr: {
                    trackingCode: statusSiteDto.trackingCode,
                    campId: statusSiteDto.campId,
                  },
                },
              },
            ],
          },
        },
      ]);
      if (campaignResponse.length > 0) {
        throw new Error('nothing to show');
      } else {
        return await this.campaignModel.findOne(
          {
            siteId: statusSiteDto.siteId,
            _id: statusSiteDto.campId,
          },
          { userId: 0, siteId: 0, __v: 0 },
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}
