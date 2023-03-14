import { Module } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { ChannelsController } from "./channels.controller";
import { Channel } from "../entities/channel.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelChat } from "src/entities/channel-chat.entity";
import { EventsModule } from "../events/events.module";
import { User } from "src/entities/user.entity";
import { Workspace } from "src/entities/workspace.entity";
import { ChannelMember } from "src/entities/channel-member.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channel,
      ChannelChat,
      User,
      Workspace,
      ChannelMember,
    ]),
    EventsModule,
  ],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
