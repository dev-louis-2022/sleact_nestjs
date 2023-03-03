import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelChatsService } from './channel-chats.service';
import { CreateChannelChatDto } from './dto/create-channel-chat.dto';
import { UpdateChannelChatDto } from './dto/update-channel-chat.dto';

@ApiTags('CHANNEL_CHAT')
@Controller('channel-chats')
export class ChannelChatsController {
  constructor(private readonly channelChatsService: ChannelChatsService) {}

  @Post()
  create(@Body() createChannelChatDto: CreateChannelChatDto) {
    return this.channelChatsService.create(createChannelChatDto);
  }

  @Get()
  findAll() {
    return this.channelChatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelChatsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChannelChatDto: UpdateChannelChatDto,
  ) {
    return this.channelChatsService.update(+id, updateChannelChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelChatsService.remove(+id);
  }
}
