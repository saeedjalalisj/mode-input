import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CampaignResponseService } from './campaign-response.service';
import { CreateCampaignResponseDto } from './dto/create-campaign-response.dto';
import { UpdateCampaignResponseDto } from './dto/update-campaign-response.dto';

@Controller('campaign-response')
export class CampaignResponseController {
  constructor(private readonly campaignResponseService: CampaignResponseService) {}

  @Post()
  create(@Body() createCampaignResponseDto: CreateCampaignResponseDto) {
    return this.campaignResponseService.create(createCampaignResponseDto);
  }

  @Get()
  findAll() {
    return this.campaignResponseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignResponseService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCampaignResponseDto: UpdateCampaignResponseDto) {
    return this.campaignResponseService.update(+id, updateCampaignResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignResponseService.remove(+id);
  }
}
