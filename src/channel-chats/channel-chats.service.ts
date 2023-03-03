import { Injectable } from '@nestjs/common';
import { CreateChannelChatDto } from './dto/create-channel-chat.dto';
import { UpdateChannelChatDto } from './dto/update-channel-chat.dto';

@Injectable()
export class ChannelChatsService {
  create(createChannelChatDto: CreateChannelChatDto) {
    return 'This action adds a new channelChat';
  }

  findAll() {
    return `This action returns all channelChats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} channelChat`;
  }

  update(id: number, updateChannelChatDto: UpdateChannelChatDto) {
    return `This action updates a #${id} channelChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} channelChat`;
  }
}
