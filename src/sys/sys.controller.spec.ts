import { Test, TestingModule } from '@nestjs/testing';
import { SysController } from './sys.controller';
import { SysService } from './sys.service';

describe('SysController', () => {
  let controller: SysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysController],
      providers: [SysService],
    }).compile();

    controller = module.get<SysController>(SysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
