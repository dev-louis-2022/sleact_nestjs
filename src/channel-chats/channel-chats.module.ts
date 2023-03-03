import { Module } from '@nestjs/common';
import { ChannelChatsService } from './channel-chats.service';
import { ChannelChatsController } from './channel-chats.controller';

@Module({
  controllers: [ChannelChatsController],
  providers: [ChannelChatsService]
})
export class ChannelChatsModule {}
