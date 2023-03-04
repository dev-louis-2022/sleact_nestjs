import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import bcrypt from "bcrypt";
import { WorkspaceMember } from "src/workspace-members/entities/workspace-member.entity";
import { ChannelMember } from "src/channel-members/entities/channel-member.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(WorkspaceMember)
    private workspaceMembersRepository: Repository<WorkspaceMember>,
    @InjectRepository(ChannelMember)
    private channelMembersRepository: Repository<ChannelMember>,
    private dataSource: DataSource
  ) {}

  async create(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await queryRunner.manager.getRepository(User).findOne({
      where: { email },
    });
    if (user) {
      throw new BadRequestException("이미 존재하는 사용자입니다.");
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const tempUser = queryRunner.manager.getRepository(User).create();
      tempUser.email = email;
      tempUser.nickname = nickname;
      tempUser.password = hashedPassword;
      const resultUser = await queryRunner.manager
        .getRepository(User)
        .save(tempUser);

      // 신규 가입 시 기본 workspace와 기본 channel 추가
      const workspaceMember = queryRunner.manager
        .getRepository(WorkspaceMember)
        .create();
      workspaceMember.userId = resultUser.id;
      workspaceMember.workspaceId = 1;
      await queryRunner.manager
        .getRepository(WorkspaceMember)
        .save(workspaceMember);

      const channelMember = queryRunner.manager
        .getRepository(ChannelMember)
        .create();
      channelMember.userId = resultUser.id;
      channelMember.channelId = 1;
      await queryRunner.manager
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
