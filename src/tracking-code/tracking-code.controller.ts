import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { TrackingCodeService } from './tracking-code.service';
import { TrackingCode } from './entities/tracking-code.entity';
import { ApiResponse } from '@nestjs/swagger';

@Controller('tracking-code')
export class TrackingCodeController {
  constructor(private readonly trackingCodeService: TrackingCodeService) {}

  /**
   * creating new tracking code
   */
  @Get()
  @ApiResponse({ status: 200, description: 'return a tracking code ', type: TrackingCode })
  create(): Promise<Error | TrackingCode> {
    try {
      return this.trackingCodeService.create();
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
