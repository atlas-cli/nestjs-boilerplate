import { Test, TestingModule } from '@nestjs/testing';
import { AccessControlGuard } from '../common/access-control/access-control.guard';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;

  const mock_ForceFailGuard = { CanActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SubscriptionsService,
          useValue: {},
        },
      ],
      controllers: [SubscriptionsController],
    })
      .overrideGuard(AccessControlGuard)
      .useValue(mock_ForceFailGuard)
      .compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
