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
} from '@nestjs/common';
import { SiteService } from './site.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../decorators/user.decorator';
import { PaginationDto } from '../shared/pagination.dto';

@Controller('site')
@UseGuards(AuthGuard('jwt'))
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteDto, @CurrentUser() currentUser) {
    return this.siteService.create(createSiteDto, currentUser.userId);
  }

  @Get()
  findAll(@Query() query: PaginationDto, @CurrentUser() currentUser) {
    return this.siteService.findAll(
      query.page,
      query.perPage,
      currentUser.userId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.siteService.findOne(id);
  }

  @Put(':id')
  @HttpCode(204)
  update(
    @Param('id') id: string,
    @Body() updateSiteDto: UpdateSiteDto,
    @CurrentUser() currentUser,
  ) {
    return this.siteService.update(id, updateSiteDto, currentUser.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() currentUser) {
    return this.siteService.remove(id, currentUser.userId);
  }
}
