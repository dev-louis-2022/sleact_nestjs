import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelMember } from "src/entities/channel-member.entity";
import { User } from "src/entities/user.entity";
import { WorkspaceMember } from "src/entities/workspace-member.entity";
import { DataSource, Repository } from "typeorm";
import { Workspace } from "../entities/workspace.entity";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WorkspaceMember)
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
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

  async create(url: string, name: string, ownerId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // workspace, workspaceMember
      const workspace = await this.dataSource.manager
        .getRepository(Workspace)
        .save({
          url,
          name,
          ownerId,
        });
      const workspaceMember = await this.dataSource.manager
        .getRepository(WorkspaceMember)
        .save({
          workspaceId: workspace.id,
          userId: workspace.ownerId,
        });

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
      .createQueryBuilder("U")
      .innerJoin("U.WorkspaceMembers", "WM")
      .innerJoin("WM.Workspace", "W", "url = :url", { url })
      .getMany();
  }

  async createWorkspaceMembers(url: string, email: any) {
    const workspace = await this.workspaceRepository
      .createQueryBuilder("workspace")
      .where("workspace.url = :url", { url })
      .innerJoinAndSelect("workspace.Channels", "channels")
      .getOne();

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException("없는 사용자 입니다.");
    }

    const workspaceMember = new WorkspaceMember();
    workspaceMember.workspaceId = workspace.id;
    workspaceMember.userId = user.id;
    await this.workspaceMemberRepository.save(workspaceMember);

    const channelMember = new ChannelMember();
    channelMember.channelId = workspace.Channels.find(
      (v) => v.name === "일반"
    ).id;
    channelMember.userId = user.id;
    await this.channelMemberRepository.save(channelMember);

    return null;
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id })
      .innerJoin("user.WorkspaceMembers", "workspaceMembers")
      .innerJoin(
        "workspaceMembers.Workspace",
        "workspace",
        "workspace.url = :url",
        { url }
      )
      .getOne();
  }
}
