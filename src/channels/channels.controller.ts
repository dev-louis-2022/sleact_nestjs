import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { User } from "src/common/decorators/user.decorator";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { PostChannelChat } from "./dto/post-channel-chat.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import multer from "multer";
import path from "path";

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

  @UseInterceptors(
    FilesInterceptor("image", 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, "uploads/");
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, //5MB
    })
  )
  @Post(":name/images")
  async postImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param("url") url: string,
    @Param("name") name: string,
    @User() user
  ) {
    return await this.channelsService.createWorkspaceChannelImages(
      url,
      name,
      files,
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
