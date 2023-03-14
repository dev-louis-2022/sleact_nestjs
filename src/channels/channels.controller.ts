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
  UseGuards,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserDecoretor } from "src/common/decorators/user.decorator";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import multer from "multer";
import path from "path";
import { LoggedInGuard } from "src/auth/logged-in-guard";
import { User } from "src/entities/user.entity";

@ApiTags("CHANNEL")
@UseGuards(LoggedInGuard)
@Controller("api/channels")
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiOperation({ summary: "워크스페이스 채널 모두 가져오기" })
  @Get(":url/channels")
  async getWorkspaceChannels(
    @Param("url") url: string,
    @UserDecoretor() user: User
  ) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @ApiOperation({ summary: "워크스페이스 특정 채널 가져오기" })
  @Get(":url/channels/:name")
  async getWorkspaceChannel(
    @Param("url") url: string,
    @Param("name") name: string
  ) {
    return this.channelsService.getWorkspaceChannel(url, name);
  }

  @ApiOperation({ summary: "워크스페이스 채널 만들기" })
  @Post(":url/channels")
  async createWorkspaceChannels(
    @Param("url") url,
    @Body() body: CreateChannelDto,
    @UserDecoretor() user: User
  ) {
    return this.channelsService.createWorkspaceChannels(
      url,
      body.name,
      user.id
    );
  }

  @ApiOperation({ summary: "워크스페이스 채널 멤버 가져오기" })
  @Get(":url/channels/:name/members")
  async getWorkspaceMembers(
    @Param("url") url: string,
    @Param("name") name: string
  ) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @ApiOperation({ summary: "워크스페이스 채널 멤버 초대하기" })
  @Post(":url/channels/:name/members")
  async createWorkspaceMembers(
    @Param("url") url: string,
    @Param("name") name: string,
    @Body("email") email: string
  ) {
    return this.channelsService.createWorkspaceChannelMembers(url, name, email);
  }

  @ApiOperation({ summary: "워크스페이스 특정 채널 채팅 모두 가져오기" })
  @Get(":url/channels/:name/chats")
  async getWorkspaceChannelChats(
    @Param("url") url,
    @Param("name") name,
    @Query("perPage", ParseIntPipe) perPage: number,
    @Query("page", ParseIntPipe) page: number
  ) {
    return this.channelsService.getWorkspaceChannelChats(
      url,
      name,
      perPage,
      page
    );
  }

  @ApiOperation({ summary: "워크스페이스 특정 채널 채팅 생성하기" })
  @Post(":url/channels/:name/chats")
  async createWorkspaceChannelChats(
    @Param("url") url,
    @Param("name") name,
    @Body("content") content,
    @UserDecoretor() user
  ) {
    return await this.channelsService.postChat(url, name, content, user);
  }

  @ApiOperation({ summary: "워크스페이스 특정 채널 이미지 업로드하기" })
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
  @Post(":url/channels/:name/images")
  async postImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param("url") url: string,
    @Param("name") name: string,
    @UserDecoretor() user
  ) {
    return await this.channelsService.createWorkspaceChannelImages(
      url,
      name,
      files,
      user
    );
  }

  @ApiOperation({ summary: "안 읽은 개수 가져오기" })
  @Get(":url/channels/:name/unreads")
  async getUnreads(
    @Param("url") url,
    @Param("name") name,
    @Query("after", ParseIntPipe) after: number
  ) {
    return this.channelsService.getChannelUnreadsCount(url, name, after);
  }
}
