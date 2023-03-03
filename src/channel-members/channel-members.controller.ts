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
import { ChannelMembersService } from './channel-members.service';
import { CreateChannelMemberDto } from './dto/create-channel-member.dto';
import { UpdateChannelMemberDto } from './dto/update-channel-member.dto';

@ApiTags('CHANNEL_MEMBER')
@Controller('channel-members')
export class ChannelMembersController {
  constructor(private readonly channelMembersService: ChannelMembersService) {}

  @Post()
  create(@Body() createChannelMemberDto: CreateChannelMemberDto) {
    return this.channelMembersService.create(createChannelMemberDto);
  }

  @Get()
  findAll() {
    return this.channelMembersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelMembersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChannelMemberDto: UpdateChannelMemberDto,
  ) {
    return this.channelMembersService.update(+id, updateChannelMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelMembersService.remove(+id);
  }
}
