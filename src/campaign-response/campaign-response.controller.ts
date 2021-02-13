import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Ip,
  Headers,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { CampaignResponseService } from './campaign-response.service';
import { CreateCampaignResponseDto } from './dto/create-campaign-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateCampaignResponseInterface } from './interface/create-campaign-response.interface';
import { CurrentUser } from '../decorators/user.decorator';
import { Agent } from '../decorators/agent.decorator';
import { PaginationDto } from './dto/pagination.dto';
import { SendError } from '../shared/sendError';

@Controller('response')
export class CampaignResponseController {
  constructor(
    private readonly campaignResponseService: CampaignResponseService,
  ) {}

  @Post(':campId')
  create(
    @Body() createCampaignResponseDto: CreateCampaignResponseDto,
    @Param('campId') campId: string,
    @Ip() ip,
    @Agent() agent,
    @Headers('tracking-code') trackingCode,
  ) {
    try {
      if (!trackingCode) {
        SendError('tracking code not found', HttpStatus.NOT_FOUND);
      }
      const campRespDto: CreateCampaignResponseInterface = {
        ...createCampaignResponseDto,
        ip,
        agent,
        campId,
      };
      return this.campaignResponseService.create(campRespDto);
    } catch (err) {
      SendError(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:campId')
  findAll(
    @Param('campId') campId: string,
    @CurrentUser() currentUser,
    @Query() query: PaginationDto,
  ) {
    return this.campaignResponseService.findAll(
      campId,
      currentUser.userId,
      Number(query.page),
      Number(query.perPage),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignResponseService.findOne(id);
  }
}
