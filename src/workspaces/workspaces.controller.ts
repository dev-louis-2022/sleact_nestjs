import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { WorkspacesService } from "./workspaces.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/common/decorators/user.decorator";
import { LoggedInGuard } from "src/auth/logged-in-guard";

@ApiTags("WORKSPACE")
@UseGuards(LoggedInGuard)
@Controller("workspaces")
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

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
  async create(@User() user, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    // dto 사용으로 validation 실행
    return await this.workspacesService.create(
      createWorkspaceDto.url,
      createWorkspaceDto.name,
      user.id
    );
  }

  @Get()
  async getMyWorkspaces(@User() user) {
    return await this.workspacesService.findMyWorkspaces(user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.workspacesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto
  ) {
    return this.workspacesService.update(+id, updateWorkspaceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.workspacesService.remove(+id);
  }
}
