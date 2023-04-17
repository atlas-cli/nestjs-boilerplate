import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './../users.service';
import { Organization } from './models/organization.model';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  const mockRepository = {
    find() {
      return {};
    },
  };
  const mockService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Organization.name),
          useValue: mockRepository,
        },
        {
          provide: UsersService,
          useValue: mockService,
        },
        OrganizationsService,
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
