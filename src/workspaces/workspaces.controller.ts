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
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDecoretor } from "src/common/decorators/user.decorator";
import { LoggedInGuard } from "src/auth/logged-in-guard";
import { User } from "src/entities/user.entity";

@ApiTags("WORKSPACE")
@UseGuards(LoggedInGuard)
@Controller("api/workspaces")
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @ApiOperation({ summary: "내 워크스페이스 가져오기" })
  @Get()
  async getMyWorkspaces(@UserDecoretor() user: User) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @ApiOperation({ summary: "워크스페이스 생성" })
  @ApiResponse({
    status: 200,
    description: "성공",
  })
  @ApiResponse({
    status: 500,
    description: "실패",
  })
  @Post()
  async create(
    @UserDecoretor() user,
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

  @ApiOperation({ summary: "워크스페이스 특정 멤버 가져오기" })
  @Get(":url/members/:id")
  async getWorkspaceMember(
    @Param("url") url: string,
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }
}
