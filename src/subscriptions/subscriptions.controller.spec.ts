import { Test, TestingModule } from '@nestjs/testing';
import { AccessControlGuard } from '../common/access-control/access-control.guard';
import { UsersController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mock_ForceFailGuard = { CanActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SubscriptionsService,
          useValue: {},
        },
      ],
      controllers: [UsersController],
    })
      .overrideGuard(AccessControlGuard)
      .useValue(mock_ForceFailGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
