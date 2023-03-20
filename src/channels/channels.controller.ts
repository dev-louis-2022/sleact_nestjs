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
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import multer from "multer";
import path from "path";
import { LoggedInGuard } from "src/auth/logged-in-guard";
import { User } from "src/entities/user.entity";
import { processResponseData as ProcessResponseDataInterceptor } from "src/common/interceptors/processResponseData.interceptor";

@UseInterceptors(ProcessResponseDataInterceptor)
@ApiCookieAuth("connect.sid")
@UseGuards(LoggedInGuard)
@ApiTags("CHANNEL")
@Controller("api/workspaces")
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiOperation({ summary: "워크스페이스 채널 모두 가져오기" })
  @Get(":url/channels")
  async getWorkspaceChannels(
    @Param("url") url: string,
    @UserDecorator() user: User
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
    @Param("url") url: string,
    @Body() body: CreateChannelDto,
    @UserDecorator() user: User
  ) {
    return this.channelsService.createWorkspaceChannels(
      url,
      body.name,
      user.id
    );
  }

  @ApiOperation({ summary: "워크스페이스 채널 멤버 가져오기" })
  @Get(":url/channels/:name/members")
  async getWorkspaceChannelMembers(
    @Param("url") url: string,
    @Param("name") name: string
  ) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @ApiOperation({ summary: "워크스페이스 채널 멤버 초대하기" })
  @Post(":url/channels/:name/members")
  async createWorkspaceChannelMembers(
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
  async createWorkspaceChannelChat(
    @Param("url") url: string,
    @Param("name") name: string,
    @Body("content") content,
    @UserDecorator() user: User
  ) {
    return this.channelsService.createWorkspaceChannelChat(
      url,
      name,
      content,
      user
    );
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
  async createWorkspaceChannelImages(
    @Param("url") url: string,
    @Param("name") name: string,
    @UploadedFiles() files: Express.Multer.File[],
    @UserDecorator() user
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
  async getWorkspaceChannelChatUnreadsCount(
    @Param("url") url: string,
    @Param("name") name: string,
    @Query("after", ParseIntPipe) after: number
  ) {
    return this.channelsService.getWorkspaceChannelChatUnreadsCount(
      url,
      name,
      after
    );
  }
}
