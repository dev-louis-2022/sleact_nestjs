import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User } from "src/common/decorators/user.decorator";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { PostChannelChat } from "./dto/post-channel-chat.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";

@ApiTags("CHANNEL")
@Controller("channels")
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post(":name/chats")
  async postChat(@Body() body: PostChannelChat, @User() user) {
    return await this.channelsService.postChat(
      body.url,
      body.name,
      body.content,
      user
    );
  }

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.channelsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(+id, updateChannelDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.channelsService.remove(+id);
  }
}
