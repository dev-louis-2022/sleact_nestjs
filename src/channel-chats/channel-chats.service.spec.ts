import { Test, TestingModule } from '@nestjs/testing';
import { ChannelChatsService } from './channel-chats.service';

describe('ChannelChatsService', () => {
  let service: ChannelChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelChatsService],
    }).compile();

    service = module.get<ChannelChatsService>(ChannelChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
