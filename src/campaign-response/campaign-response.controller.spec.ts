import { Test, TestingModule } from '@nestjs/testing';
import { CampaignResponseController } from './campaign-response.controller';
import { CampaignResponseService } from './campaign-response.service';

describe('CampaignResponseController', () => {
  let controller: CampaignResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignResponseController],
      providers: [CampaignResponseService],
    }).compile();

    controller = module.get<CampaignResponseController>(CampaignResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
