import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PaginationDto } from './dto/pagination.dto';
import { CurrentUser } from '../decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('campaign')
@UseGuards(AuthGuard('jwt'))
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto, @CurrentUser() currentUser) {
    return this.campaignService.create(createCampaignDto, currentUser.userId);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @CurrentUser() currentUser) {
    return this.campaignService.findAll(query.page, query.perPage, currentUser.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser) {
    return this.campaignService.findOne(id, currentUser.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto, @CurrentUser() currentUser) {
    return this.campaignService.update(id, updateCampaignDto, currentUser.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser) {
    return this.campaignService.remove(id, currentUser.userId);
  }
}
