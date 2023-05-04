import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Plan } from './models/plan.model';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  const mockRepository = {
    find() {
      return {};
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Plan.name),
          useValue: mockRepository,
        },
        SubscriptionsService,
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
