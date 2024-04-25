import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { ConfigModule } from '@nestjs/config';

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientsService],
      imports: [
        ConfigModule,
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
