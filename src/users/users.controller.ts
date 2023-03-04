import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseInterceptors,
  UseGuards,
  Next,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { processResponseData as ProcessResponseDataInterceptor } from "src/common/interceptors/processResponseData.interceptor";
import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { LoggedInGuard } from "src/auth/logged-in-guard";
import { NotLoggedInGuard } from "src/auth/not-logged-in-guard";
import { User } from "src/common/decorators/user.decorator";
import { nextTick } from "process";

@UseInterceptors(ProcessResponseDataInterceptor)
@ApiTags("USER")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "로그인" })
  @ApiResponse({
    status: 200,
    description: "성공",
  })
  @ApiResponse({
    status: 500,
    description: "실패",
  })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  logIn(@User() user) {
    console.log(user);
    return user;
  }

  @ApiOperation({ summary: "로그아웃" })
  @UseGuards(LoggedInGuard)
  @Post("logout")
  logOut(@Req() req, @Res() res, @Next() next) {
    req.logOut((error) => {
      if (error) {
        return next(error);
      }
      return res.send("ok");
    });
  }

  @ApiOperation({ summary: "회원가입" })
  @UseGuards(NotLoggedInGuard)
  @Post("join")
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(
      createUserDto.email,
      createUserDto.nickname,
      createUserDto.password
    );
  }

  @Get("all")
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
