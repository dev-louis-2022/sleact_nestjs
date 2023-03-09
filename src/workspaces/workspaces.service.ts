import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { WorkspaceMember } from "src/entities/workspace-member.entity";
import { DataSource, Repository } from "typeorm";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { Workspace } from "../entities/workspace.entity";

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

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
