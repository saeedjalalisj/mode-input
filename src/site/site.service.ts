import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from './entities/site.entity';
import { SendError } from '../shared/sendError';

@Injectable()
export class SiteService {
  constructor(
    @InjectModel(Site.name)
    private siteModel: Model<SiteDocument>,
  ) {}

  async create(createSiteDto: CreateSiteDto, userId: string) {
    try {
      const newSite: CreateSiteDto & { userId: string } = {
        ...createSiteDto,
        userId,
      };
      return await new this.siteModel(newSite).save();
    } catch (err) {
      SendError(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(page: number, perPage = 5, userId: string) {
    try {
      page = page - 1 > 0 ? page - 1 : 0;
      perPage = perPage * 1;
      return await this.siteModel
        .find({ userId })
        .limit(perPage)
        .skip(perPage * page)
        .exec();
    } catch (err) {
      SendError(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      // todo: only show user created site -> add site_id
      return await this.siteModel.findById(id);
    } catch (err) {
      SendError(err, HttpStatus.NOT_FOUND);
    }
  }

  update(id: number, updateSiteDto: UpdateSiteDto) {
    return `This action updates a #${id} site`;
  }

  remove(id: number) {
    return `This action removes a #${id} site`;
  }
}