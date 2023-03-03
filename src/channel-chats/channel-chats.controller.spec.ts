import { Test, TestingModule } from '@nestjs/testing';
import { ChannelChatsController } from './channel-chats.controller';
import { ChannelChatsService } from './channel-chats.service';

describe('ChannelChatsController', () => {
  let controller: ChannelChatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelChatsController],
      providers: [ChannelChatsService],
    }).compile();

    controller = module.get<ChannelChatsController>(ChannelChatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
