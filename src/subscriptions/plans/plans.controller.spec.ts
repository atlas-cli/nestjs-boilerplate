import { Test, TestingModule } from '@nestjs/testing';
import { AccessControlGuard } from './../../common/access-control/access-control.guard';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

describe('PlansController', () => {
  let controller: PlansController;

  const mock_ForceFailGuard = { CanActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PlansService,
          useValue: {},
        },
      ],
      controllers: [PlansController],
    })

      .overrideGuard(AccessControlGuard)
      .useValue(mock_ForceFailGuard)
      .compile();

    controller = module.get<PlansController>(PlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
