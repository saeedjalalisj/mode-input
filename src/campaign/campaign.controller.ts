import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
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

  @Get(':page')
  findAll(@Param(':page') page: number, perPage = 5, @CurrentUser() currentUser) {
    return this.campaignService.findAll(page, perPage, currentUser.userId);
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
