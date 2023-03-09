import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { WorkspaceMember } from "src/entities/workspace-member.entity";
import { ChannelMember } from "src/entities/channel-member.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, WorkspaceMember, ChannelMember])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
