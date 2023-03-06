import { Module } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { ChannelsController } from "./channels.controller";
import { Channel } from "./entities/channel.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelChat } from "src/channel-chats/entities/channel-chat.entity";
import { EventsModule } from "../events/events.module";

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ChannelChat]), EventsModule],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
