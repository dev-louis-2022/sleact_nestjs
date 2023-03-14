import { Injectable, NotFoundException, UseInterceptors } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelChat } from "src/entities/channel-chat.entity";
import { EventsGateway } from "src/events/events.gateway";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { Channel } from "../entities/channel.entity";

@Injectable()
export class ChannelsService {
  getChannelUnreadsCount(url: any, name: any, after: number) {
    throw new Error("Method not implemented.");
  }
  getWorkspaceChannelChats(url: any, name: any, perPage: number, page: number) {
    throw new Error("Method not implemented.");
  }
  createWorkspaceChannelMembers(url: string, name: string, email: string) {
    throw new Error("Method not implemented.");
  }
  getWorkspaceChannelMembers(url: string, name: string) {
    throw new Error("Method not implemented.");
  }
  createWorkspaceChannels(url: any, name: string, id: number) {
    throw new Error("Method not implemented.");
  }
  getWorkspaceChannel(url: string, name: string) {
    throw new Error("Method not implemented.");
  }
  getWorkspaceChannels(url: string, id: number) {
    throw new Error("Method not implemented.");
  }
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

  async createWorkspaceChannelImages(
    url: string,
    name: string,
    files: Express.Multer.File[],
    user: User
  ) {
    console.log(files);
    const channel = await this.channelRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "W", "W.url = :url", { url })
      .where("channel.name = :name", { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException("채널이 존재하지 않습니다.");
    }
    for (let i = 0; i < files.length; i++) {
      const chats = new ChannelChat();
      chats.content = files[i].path;
      chats.userId = user.id;
      chats.channelId = channel.id;
      const chat = await this.channelChatRepository.save(chats);
      chat.Channel = channel;
      chat.User = user;

      this.eventsGateway.server
        .to(`/ws-${url}-${channel.id}`)
        .emit("message", chat);
    }
    return null;
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
