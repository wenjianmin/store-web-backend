import { Test, TestingModule } from '@nestjs/testing';
import { SysService } from './sys.service';

describe('SysService', () => {
  let service: SysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SysService],
    }).compile();

    service = module.get<SysService>(SysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
