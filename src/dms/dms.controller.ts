import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { UseGuards } from "@nestjs/common/decorators";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import multer from "multer";
import path from "path";
import { LoggedInGuard } from "src/auth/logged-in-guard";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { User } from "src/entities/user.entity";
import { DmsService } from "./dms.service";

@ApiCookieAuth("connect.sid")
@UseGuards(LoggedInGuard)
@ApiTags("DM")
@Controller("api/workspaces")
export class DmsController {
  constructor(private readonly dmsService: DmsService) {}

  @ApiOperation({ summary: "워크스페이스 DM 모두 가져오기" })
  @Get(":id/dms")
  async getWorkspaceDMs(@Param("url") url, @UserDecorator() user: User) {
    return this.dmsService.getWorkspaceDMs(url, user.id);
  }

  @ApiOperation({ summary: "워크스페이스 특정 DM 채팅 모두 가져오기" })
  @Get(":url/dms/:id/chats")
  async getWorkspaceDMChats(
    @Param("url") url,
    @Param("id", ParseIntPipe) id: number,
    @Query("perPage", ParseIntPipe) perPage: number,
    @Query("page", ParseIntPipe) page: number
  ) {
    return this.dmsService.getWorkspaceDMChats(url, id, perPage, page);
  }

  @ApiOperation({ summary: "워크스페이스 특정 DM 채팅 생성하기" })
  @Post(":url/dms/:id/chats")
  async createWorkspaceDMChats(
    @Param("url") url,
    @Param("id", ParseIntPipe) id: number,
    @Body("content") content,
    @UserDecorator() user: User
  ) {
    return this.dmsService.createWorkspaceDMChats(url, id, content, user.id);
  }

  @ApiOperation({ summary: "워크스페이스 특정 DM 이미지 업로드하기" })
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
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    })
  )
  @Post(":url/dms/:id/images")
  async createWorkspaceDMImages(
    @Param("url") url,
    @Param("id", ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @UserDecorator() user: User
  ) {
    return this.dmsService.createWorkspaceDMImages(url, files, id, user.id);
  }

  @ApiOperation({ summary: "안 읽은 개수 가져오기" })
  @Get(":url/dms/:id/unreads")
  async getUnreads(
    @Param("url") url,
    @Param("id", ParseIntPipe) id: number,
    @Query("after", ParseIntPipe) after: number,
    @UserDecorator() user: User
  ) {
    return this.dmsService.getDMUnreadsCount(url, id, user.id, after);
  }
}
