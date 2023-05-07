import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './models/product.model';
import { Subscription } from './models/subscription.model';
import { PlansService } from './plans/plans.service';
import { ConfigService } from '@nestjs/config';
import { OrganizationsService } from './../users/organizations/organizations.service';
import { STRIPE_CLIENT_TOKEN } from '@golevelup/nestjs-stripe';

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
          provide: getModelToken(Product.name),
          useValue: mockRepository,
        },
        {
          provide: getModelToken(Subscription.name),
          useValue: mockRepository,
        },
        {
          provide: STRIPE_CLIENT_TOKEN,
          useValue: {},
        },
        {
          provide: PlansService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: OrganizationsService,
          useValue: {},
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
