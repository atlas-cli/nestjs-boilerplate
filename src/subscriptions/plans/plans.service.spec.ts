import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from './../../subscriptions/models/product.model';
import { Plan } from './../../subscriptions/models/plan.model';
import { PlansService } from './plans.service';

describe('PlansService', () => {
  let service: PlansService;
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
        {
          provide: getModelToken(Product.name),
          useValue: mockRepository,
        },
        PlansService,
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
