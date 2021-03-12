import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from './entities/site.entity';

@Injectable()
export class SiteService {
  constructor(
    @InjectModel(Site.name)
    private siteModel: Model<SiteDocument>,
  ) {}

  async create(
    createSiteDto: CreateSiteDto,
    userId: string,
  ): Promise<Site> {
    try {
      const newSite: CreateSiteDto & { userId: string } = {
        ...createSiteDto,
        userId,
      };
      const createdSite = new this.siteModel(newSite);
      return await createdSite.save();
    } catch (err) {
      throw err;
    }
  }

  async findAll(
    page: number,
    perPage = 5,
    userId: string,
  ): Promise< Site[]> {
    try {
      page = page - 1 > 0 ? page - 1 : 0;
      perPage = perPage * 1;
      return await this.siteModel
        .find({ userId })
        .limit(perPage)
        .skip(perPage * page)
        .exec();
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string, userId: string): Promise<Site> {
    try {
      const site = await this.siteModel.findOne({ _id: id, userId });
      if (site == null) {
        throw new Error('site not found');
      }
      return site;
    } catch (err) {
      throw err;
    }
  }

  async update(
    id: string,
    updateSiteDto: UpdateSiteDto,
    userId: string,
  ): Promise<any> {
    try {
      return await this.siteModel.updateOne({ _id: id, userId }, updateSiteDto);
    } catch (err) {
      throw err;
    }
  }

  async remove(id: string, userId) {
    try {
      return await this.siteModel.deleteOne({ _id: id, userId });
    } catch (err) {
      throw err;
    }
  }
}
