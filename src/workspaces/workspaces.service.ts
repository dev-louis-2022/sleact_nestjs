import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { WorkspaceMember } from "src/entities/workspace-member.entity";
import { DataSource, Repository } from "typeorm";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { Workspace } from "../entities/workspace.entity";
import { Channel } from "src/entities/channel.entity";
import { ChannelMember } from "src/entities/channel-member.entity";
import { NotFoundException } from "@nestjs/common/exceptions";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource
  ) {}

  async findById(id: number) {
    return await this.workspaceRepository.findOneBy({ id });
  }

  async findMyWorkspaces(myId: number) {
    return await this.workspaceRepository.find({
      where: {
        Members: [{ userId: myId }],
      },
    });
  }

  async create(url: string, name: string, myId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // workspace, workspaceMember
      const workspace = new Workspace();
      workspace.url = url;
      workspace.name = name;
      workspace.ownerId = myId;
      const savedWorkspace = await this.dataSource.manager
        .getRepository(Workspace)
        .save(workspace);

      const workspaceMember = new WorkspaceMember();
      workspaceMember.workspaceId = savedWorkspace.id;
      workspaceMember.userId = myId;
      await this.dataSource.manager
        .getRepository(WorkspaceMember)
        .save(workspaceMember);

      // channel, channelMember
      const channel = new Channel();
      channel.name = "일반";
      channel.workspaceId = savedWorkspace.id;
      const savedChannel = await this.dataSource.manager
        .getRepository(Channel)
        .save(channel);

      const channelMember = new ChannelMember();
      channelMember.channelId = savedChannel.id;
      channelMember.userId = myId;
      await this.dataSource.manager
        .getRepository(ChannelMember)
        .save(channelMember);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMembers(url: string) {
    return this.userRepository
      .createQueryBuilder("user")
      .innerJoin("user.WorkspaceMembers", "members")
      .innerJoin("members.Workspace", "workspace", "workspace.url = :url", {
        url,
      })
      .getMany();
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id })
      .innerJoin("user.OwnerWorkspaces", "workspace", "workspace.url = :url", {
        url,
      })
      .getOne();
  }

  async createWorkspaceMembers(url: string, email: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const workspace = await queryRunner.manager
        .getRepository(Workspace)
        .createQueryBuilder("workspace")
        .where("workspace.url = :url", { url })
        .innerJoinAndSelect("workspace.Channels", "channel")
        .getOne();

      const user = await queryRunner.manager
        .getRepository(User)
        .findOneBy({ email });
      if (!user) {
        throw new NotFoundException();
      }
      // workspaceMember, channelMember
      const workspaceMember = new WorkspaceMember();
      workspaceMember.workspaceId = workspace.id;
      workspaceMember.userId = user.id;
      await queryRunner.manager
        .getRepository(WorkspaceMember)
        .save(workspaceMember);

      const channelMember = new ChannelMember();
      channelMember.channelId = workspace.Channels.find(
        (v) => v.name === "일반"
      ).id;
      channelMember.userId = user.id;
      await queryRunner.manager
        .getRepository(ChannelMember)
        .save(channelMember);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
