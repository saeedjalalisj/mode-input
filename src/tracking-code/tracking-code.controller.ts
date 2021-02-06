import { Controller, Get, Param } from '@nestjs/common';
import { TrackingCodeService } from './tracking-code.service';

@Controller('tracking-code')
export class TrackingCodeController {
  constructor(private readonly trackingCodeService: TrackingCodeService) {}

  @Get()
  create(): Promise<{ trackingCode: string }> {
    return this.trackingCodeService.create();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackingCodeService.findOne(+id);
  }
}
