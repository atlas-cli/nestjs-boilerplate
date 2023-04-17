import { Test, TestingModule } from '@nestjs/testing';
import { AccessControlGuard } from './../../common/access-control/access-control.guard';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  const mock_ForceFailGuard = { CanActivate: jest.fn(() => true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [{ provide: OrganizationsService, useValue: {} }],
    })
      .overrideGuard(AccessControlGuard)
      .useValue(mock_ForceFailGuard)
      .compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
