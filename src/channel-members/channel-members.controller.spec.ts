import { Test, TestingModule } from '@nestjs/testing';
import { ChannelMembersController } from './channel-members.controller';
import { ChannelMembersService } from './channel-members.service';

describe('ChannelMembersController', () => {
  let controller: ChannelMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelMembersController],
      providers: [ChannelMembersService],
    }).compile();

    controller = module.get<ChannelMembersController>(ChannelMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
