import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelChat } from "src/channel-chats/entities/channel-chat.entity";
import { EventsGateway } from "src/events/events.gateway";
import { Repository } from "typeorm";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { Channel } from "./entities/channel.entity";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(ChannelChat)
    private readonly channelChatRepository: Repository<ChannelChat>,
    private readonly eventsGateway: EventsGateway
  ) {}

  async postChat(url, name, content, user) {
    const channel = await this.channelRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "W", "W.url = :url", { url })
      .where("channel.name = :name", { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException("채널이 존재하지 않습니다.");
    }

    const chat = await this.channelChatRepository.save({
      content,
      userId: user.id,
      channelId: channel.id,
    });

    chat.Channel = channel;
    chat.User = user;

    this.eventsGateway.server
      .to(`/ws-${url}-${channel.id}`)
      .emit("message", chat);

    return chat;
  }

  create(createChannelDto: CreateChannelDto) {
    return "This action adds a new channel";
  }

  findAll() {
    return `This action returns all channels`;
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
