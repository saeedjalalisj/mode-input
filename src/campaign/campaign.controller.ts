import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { PaginationDto } from '../shared/pagination.dto';
import { CurrentUser } from '../decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { Campaigns } from './entities/campaign.schema';

@Controller('campaign')
@UseGuards(AuthGuard('jwt'))
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  /**
   * creating new campaign
   * @param createCampaignDto
   * @param currentUser
   */
  @Post()
  create(
    @Body() createCampaignDto: CreateCampaignDto,
    @CurrentUser() currentUser,
  ) {
    try {
      return this.campaignService.create(createCampaignDto, currentUser.userId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /***
   * list of campaign
   * @param query
   * @param currentUser
   */
  @Get()
  @ApiResponse({ status: 200, description: 'Return all campaign', type: [Campaigns] })
  @ApiResponse({ status: 500, description: 'Internal server error'})
  findAll(@Query() query: PaginationDto, @CurrentUser() currentUser) {
    try {
      return this.campaignService.findAll(
        query.page,
        query.perPage,
        currentUser.userId,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * finding one campaign
   * @param id
   * @param currentUser
   */
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return all campaign', type: Campaigns })
  @ApiResponse({ status: 500, description: 'Internal server error'})
  findOne(@Param('id') id: string, @CurrentUser() currentUser) {
    try {
      return this.campaignService.findOne(id, currentUser.userId);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * updating existing campaign
   * @param id
   * @param updateCampaignDto
   * @param currentUser
   */
  @Put(':id')
  @ApiResponse({ status: 500, description: 'Internal server error'})
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @CurrentUser() currentUser,
  ) {
    try {
      return this.campaignService.update(
        id,
        updateCampaignDto,
        currentUser.userId,
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * delete one campaign
   * @param id
   * @param currentUser
   */
  @Delete(':id')
  @ApiResponse({ status: 500, description: 'Internal server error'})
  remove(@Param('id') id: string, @CurrentUser() currentUser) {
    return this.campaignService.remove(id, currentUser.userId);
  }
}
