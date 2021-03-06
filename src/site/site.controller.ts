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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../decorators/user.decorator';
import { PaginationDto } from '../shared/pagination.dto';
import { SendError } from '../shared/sendError';
import { Site } from './entities/site.entity';
import { ApiResponse } from '@nestjs/swagger';

@Controller('site')
@UseGuards(AuthGuard('jwt'))
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Return new site', type: Site })
  create(
    @Body() createSiteDto: CreateSiteDto,
    @CurrentUser() currentUser,
  ): Promise<Error | Site> {
    try {
      return this.siteService.create(createSiteDto, currentUser.userId);
    } catch (err) {
      SendError(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all site', type: [Site] })
  findAll(
    @Query() query: PaginationDto,
    @CurrentUser() currentUser,
  ): Promise<Error | Site[]> {
    try {
      return this.siteService.findAll(
        query.page,
        query.perPage,
        currentUser.userId,
      );
    } catch (err) {
      SendError(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return one site', type: Site })
  findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser,
  ): Promise<Error | Site> {
    try {
      return this.siteService.findOne(id, currentUser.userId);
    } catch (err) {
      SendError(err, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  @HttpCode(204)
  @ApiResponse({ status: 200, description: 'update site', type: Site })
  update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @CurrentUser() currentUser,
  ): Promise<Error | Site> {
    try {
      return this.siteService.update(id, updateSiteDto, currentUser.userId);
    } catch (err) {
      SendError(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser) {
    try {
      return this.siteService.remove(id, currentUser.userId);
    } catch (err) {
      SendError(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
