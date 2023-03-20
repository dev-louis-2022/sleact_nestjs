import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelChat } from "src/entities/channel-chat.entity";
import { EventsGateway } from "src/events/events.gateway";
import { User } from "src/entities/user.entity";
import { DataSource, MoreThan, Repository } from "typeorm";
import { Channel } from "../entities/channel.entity";
import { ChannelMember } from "../entities/channel-member.entity";
import { Workspace } from "src/entities/workspace.entity";

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
    @InjectRepository(ChannelMember)
    private readonly channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(ChannelChat)
    private readonly channelChatRepository: Repository<ChannelChat>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly eventsGateway: EventsGateway,
    private readonly dataSource: DataSource
  ) {}

  async findById(id: number) {
    return this.channelRepository.findOne({ where: { id } });
  }

  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelRepository
      .createQueryBuilder("channels")
      .innerJoinAndSelect(
        "channels.Members",
        "channelMembers",
        "channelMembers.userId = :myId",
        { myId }
      )
      .innerJoinAndSelect(
        "channels.Workspace",
        "workspace",
        "workspace.url = :url",
        { url }
      )
      .getMany();
  }

  async getWorkspaceChannel(url: string, name: string) {
    return this.channelRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url,
      })
      .where("channel.name = :name", { name })
      .getOne();
  }

  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const workspace = await queryRunner.manager
        .getRepository(Workspace)
        .findOne({ where: { url } });
      if (!workspace) {
        throw new NotFoundException("존재하지 않는 워크스페이스입니다.");
      }

      const registedChannel = await queryRunner.manager
        .getRepository(Channel)
        .createQueryBuilder("channel")
        .where("channel.name = :name", { name })
        .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
          url,
        });
      if (registedChannel) {
        throw new HttpException("이미 존재하는 채널 이름입니다.", 409);
      }

      const channel = new Channel();
      channel.name = name;
      channel.workspaceId = workspace.id;
      const newChannel = await queryRunner.manager
        .getRepository(Channel)
        .save(channel);

      const channelMember = new ChannelMember();
      channelMember.channelId = newChannel.id;
      channelMember.userId = myId;
      await queryRunner.manager
        .getRepository(ChannelMember)
        .save(channelMember);

      queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      queryRunner.rollbackTransaction();
      throw error;
    } finally {
      queryRunner.release();
    }
  }

  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder("user")
      .innerJoin("user.ChannelMembers", "channelMembers")
      .innerJoin("channelMembers.Channel", "channel", "channel.name = :name", {
        name,
      })
      .innerJoin("user.WorkspaceMembers", "workspaceMembers")
      .innerJoin(
        "workspaceMembers.Workspace",
        "workspace",
        "workspace.url = :url",
        { url }
      )
      .getMany();
  }
  async createWorkspaceChannelMembers(
    url: string,
    name: string,
    email: string
  ) {
    const channel = await this.channelRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url,
      })
      .where("channel.name = :name", { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException("존재하지 않는 채널입니다.");
    }

    const registedUser = await this.usersRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .innerJoin("user.WorkspaceMembers", "workspaceMembers")
      .innerJoin(
        "workspaceMembers.Workspace",
        "workspace",
        "workspace.url = :url",
        {
          url,
        }
      )
      .getOne();

    if (registedUser) {
      throw new HttpException("이미 등록되었습니다.", 409);
    }

    const user = await this.usersRepository.findOne({ where: { email } });

    const channelMember = new ChannelMember();
    channelMember.channelId = channel.id;
    channelMember.userId = user.id;
    return await this.channelMemberRepository.save(channelMember);
  }

  async getWorkspaceChannelChats(
    url: any,
    name: any,
    perPage: number,
    page: number
  ) {
    return await this.channelChatRepository
      .createQueryBuilder("channelChats")
      .innerJoin("channelChats.Channel", "channel", "channel.name = :name", {
        name,
      })
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url,
      })
      .innerJoinAndSelect("channelChats.User", "user")
      .orderBy("channelChats.createAt", "DESC")
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createWorkspaceChannelChat(url, name, content, user) {
    const channel = await this.channelRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url,
      })
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
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url,
      })
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

  async getWorkspaceChannelChatUnreadsCount(
    url: string,
    name: string,
    after: number
  ) {
    const channel = await this.channelRepository
      .createQueryBuilder("channel")
      .innerJoin("channel.Workspace", "workspace", "workspace.url = :url", {
        url,
      })
      .where("channel.name = :name", { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException("채널이 존재하지 않습니다.");
    }

    return await this.channelChatRepository.count({
      where: {
        channelId: channel.id,
        createdAt: MoreThan(new Date(after)),
      },
    });
  }
}
