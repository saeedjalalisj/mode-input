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
  HttpStatus, HttpException, HttpCode,
} from '@nestjs/common';
import { CampaignResponseService } from './campaign-response.service';
import { CreateCampaignResponseDto } from './dto/create-campaign-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateCampaignResponseInterface } from './interface/create-campaign-response.interface';
import { CurrentUser } from '../decorators/user.decorator';
import { Agent } from '../decorators/agent.decorator';
import { PaginationDto } from './dto/pagination.dto';
import { SendError } from '../shared/sendError';
import { StatusCampaignResponseDto } from './dto/status-campaign-response.dto';

@Controller('response')
export class CampaignResponseController {
  constructor(
    private readonly campaignResponseService: CampaignResponseService,
  ) {}

  /**
   * show status of one campaign
   * @param statusSiteDto
   */
  @Post('/stat')
  @HttpCode(200)
  status(@Body() statusSiteDto: StatusCampaignResponseDto) {
    try {
      return this.campaignResponseService.status(statusSiteDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * create response of a campaign
   * @param createCampaignResponseDto
   * @param campId
   * @param ip
   * @param agent
   * @param trackingCode
   */
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

  /**
   * campaign list
   * @param campId
   * @param currentUser
   * @param query
   */
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

  /**
   * find one campaign
   * @param id
   */
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignResponseService.findOne(id);
  }

}
