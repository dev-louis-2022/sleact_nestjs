import { Module } from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { WorkspacesController } from "./workspaces.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workspace } from "../entities/workspace.entity";
import { User } from "src/entities/user.entity";
import { Channel } from "src/entities/channel.entity";
import { WorkspaceMember } from "src/entities/workspace-member.entity";
import { ChannelMember } from "src/entities/channel-member.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workspace,
      User,
      Channel,
      WorkspaceMember,
      ChannelMember,
    ]),
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
})
export class WorkspacesModule {}
