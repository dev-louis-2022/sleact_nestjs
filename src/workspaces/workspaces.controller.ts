import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { LoggedInGuard } from "src/auth/logged-in-guard";
import { processResponseData as ProcessResponseDataInterceptor } from "src/common/interceptors/processResponseData.interceptor";
import { UseInterceptors } from "@nestjs/common/decorators";
import { User } from "src/entities/user.entity";

@UseInterceptors(ProcessResponseDataInterceptor)
@ApiCookieAuth("connect.sid")
@ApiTags("WORKSPACE")
@UseGuards(LoggedInGuard)
@Controller("api/workspaces")
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @ApiOperation({ summary: "내 워크스페이스 가져오기" })
  @Get()
  async getMyWorkspaces(@UserDecorator() user: User) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @ApiOperation({ summary: "워크스페이스 생성" })
  @Post()
  async create(
    @UserDecorator() user,
    @Body() createWorkspaceDto: CreateWorkspaceDto
  ) {
    // dto 사용으로 validation 실행
    return await this.workspacesService.create(
      createWorkspaceDto.url,
      createWorkspaceDto.name,
      user.id
    );
  }

  @ApiOperation({ summary: "워크스페이스 멤버 가져오기" })
  @Get(":url/members")
  async getWorkspaceMembers(@Param("url") url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  @ApiOperation({ summary: "워크스페이스 멤버 초대하기" })
  @Post(":url/members")
  async createWorkspaceMembers(
    @Param("url") url: string,
    @Body("email") email: string
  ) {
    return this.workspacesService.createWorkspaceMembers(url, email);
  }

  @ApiOperation({ summary: "워크스페이스 특정멤버 가져오기" })
  @Get(":url/members/:id")
  async getWorkspaceMember(
    @Param("url") url: string,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }
}
