import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CampaignResponseService } from './campaign-response.service';
import { CreateCampaignResponseDto } from './dto/create-campaign-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateCampaignResponseInterface } from './interface/create-campaign-response.interface';
import { CurrentUser } from '../decorators/user.decorator';

@Controller('campaign-response')
export class CampaignResponseController {
  constructor(private readonly campaignResponseService: CampaignResponseService) {}

  @Post(':campId')
  create(@Body() createCampaignResponseDto: CreateCampaignResponseDto, @Param(':campId') campId: string) {
    const campRespDto: CreateCampaignResponseInterface = {
      ...createCampaignResponseDto,
      campId
    };
    return this.campaignResponseService.create(campRespDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:campId/:page/:perpage')
  findAll(@Param(':campId') campId: string, @CurrentUser() currentUser, @Param(':page') page, @Param(':perpage') perPage ) {
    return this.campaignResponseService.findAll(campId, currentUser.userId, page, perPage);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignResponseService.findOne(id);
  }
}
