import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ChannelChat } from "src/entities/channel-chat.entity";
import { ChannelsService } from "./channels.service";
import { Channel } from "../entities/channel.entity";

class MockChannelRepository {}
class MockChannelChatRepository {}

describe("ChannelsService", () => {
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(Channel),
          useClass: MockChannelRepository,
        },
        {
          provide: getRepositoryToken(ChannelChat),
          useClass: MockChannelChatRepository,
        },
      ],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
