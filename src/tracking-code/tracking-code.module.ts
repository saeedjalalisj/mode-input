import { Module } from '@nestjs/common';
import { TrackingCodeService } from './tracking-code.service';
import { TrackingCodeController } from './tracking-code.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingCode, TrackingCodeSchema } from './entities/tracking-code.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: TrackingCode.name, schema:TrackingCodeSchema }])],
  controllers: [TrackingCodeController],
  providers: [TrackingCodeService]
})
export class TrackingCodeModule {}
