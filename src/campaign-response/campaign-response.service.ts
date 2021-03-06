import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCampaignResponseInterface } from './interface/create-campaign-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CampaignResponse,
  CampaignResponseDocument,
} from './entities/campaign-response.entity';
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

  async create(
    createCampaignResponseDto: CreateCampaignResponseInterface,
  ): Promise<Error | CampaignResponse> {
    try {
      return await new this.campaignResponseModel(
        createCampaignResponseDto,
      ).save();
    } catch (err) {
      throw new err();
    }
  }

  async findAll(
    campId: string,
    userId: string,
    page?: number,
    perPage?: number,
  ): Promise<Error | CampaignResponse[]> {
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
      throw new err();
    }
  }

  findOne(id: string): Promise<Error | CampaignResponse> {
    try {
      return this.campaignResponseModel.findOne({ _id: id }).exec();
    } catch (err) {
      throw new err();
    }
  }

  async status(
    statusSiteDto: StatusCampaignResponseDto,
  ): Promise<Error | Campaigns> {
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
        SendError(HttpStatus.NOT_FOUND, 'nothing to show');
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
