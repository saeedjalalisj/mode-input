import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { CreateSiteDto } from '../site/dto/create-site.dto';
import { User, UserDocument } from '../user/entities/user.schema';
import { Site, SiteDocument } from '../site/entities/site.entity';
import {
  Campaigns,
  CampaignsDocument,
} from '../campaign/entities/campaign.schema';
import {
  TrackingCode,
  TrackingCodeDocument,
} from '../tracking-code/entities/tracking-code.entity';
import {
  CampaignResponse,
  CampaignResponseDocument,
} from '../campaign-response/entities/campaign-response.schema';

Injectable();
export class SeederService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Site.name)
    private siteModel: Model<SiteDocument>,
    @InjectModel(Campaigns.name)
    private campaignModel: Model<CampaignsDocument>,
    @InjectModel(CampaignResponse.name)
    private campaignResponseModel: Model<CampaignResponseDocument>,
    @InjectModel(TrackingCode.name)
    private trackingCodeModel: Model<TrackingCodeDocument>,
  ) {}
  async createUser() {
    const userDto = [];
    for (let i = 0; i <= 5; i++) {
      let role = 'user';
      if (i === 1) {
        role = 'admin';
      }
      userDto.push({
        username: `username${i}`,
        password: '123456',
        name: 't',
        family: 't',
        email: `user${i}@mail.com`,
        roles: [role],
      });
    }
    await this.userModel.insertMany(userDto);
  }
  async createSite() {
    const user = await this.userModel.findOne({ username: 'username1' });
    const sites = [];
    for (let i = 0; i <= 5; i++) {
      const siteDto: CreateSiteDto = {
        name: `site-${i}`,
        url: `site-${i}.com`,
      };
      sites.push({ ...siteDto, userId: user._id });
    }

    await this.siteModel.insertMany(sites);
  }

  async createCampaign() {
    const user = await this.userModel.findOne({ username: 'username1' });
    const site = await this.siteModel.findOne({ name: 'site-0' });
    const type = ['feedback', 'star', 'contact'];
    const campaigns = [];
    for (let i = 0; i <= 5; i++) {
      const campaign: Campaigns = {
        allow_comment: false,
        allow_email: false,
        allow_full_name: true,
        allow_mobile: false,
        allow_rating: true,
        name: `campaign-${i}`,
        require_comment: false,
        require_email: false,
        require_full_name: true,
        require_mobile: false,
        require_rating: true,
        show_thanks_message: false,
        siteId: site._id,
        subtitle: `subtitle-${i}`,
        thanks_message: '',
        title: `title-${i}`,
        type: type[Math.floor(Math.random() * 3)],
        userId: user._id,
      };
      campaigns.push(campaign);
    }
    await this.campaignModel.insertMany(campaigns);
  }

  async createCampaignResponse() {
    const campaign = await this.campaignModel.findOne({ name: 'campaign-1' });
    const campaignResponses = [];
    for (let i = 0; i <= 5; i++) {
      const trackingCode: TrackingCode = {
        code: uuid(),
        createAt: new Date(),
      };
      const newTrackingCode = await this.trackingCodeModel.create(trackingCode);
      const campaignResponse: CampaignResponse = {
        agent: 'browser',
        browser_name: '',
        browser_version: '',
        campId: campaign._id,
        comment: '',
        created_at: new Date(),
        device_name: '',
        email: '',
        full_name: `full_name${i}`,
        ip: '',
        location: [],
        mobile: '',
        os_version: '',
        rate: `${i}`,
        trackingId: newTrackingCode._id,
      };
      campaignResponses.push(campaignResponse);
    }
    await this.campaignResponseModel.insertMany(campaignResponses);
  }

  async cleanDB() {
    console.log('starting cleaning db-!!!');
    await this.userModel.deleteMany({});
    await this.siteModel.deleteMany({});
    await this.campaignModel.deleteMany({});
    await this.trackingCodeModel.deleteMany({});
    await this.campaignResponseModel.deleteMany({});
    console.log('cleaning db finished!!!');
  }

  async seed() {
    await this.cleanDB();
    await this.createUser();
    await this.createSite();
    await this.createCampaign();
    await this.createCampaignResponse();
  }
}
