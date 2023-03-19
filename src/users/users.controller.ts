import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseInterceptors,
  UseGuards,
  Next,
  ForbiddenException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto as JoinUserDto } from "./dto/create-user.dto";
import { ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { processResponseData as ProcessResponseDataInterceptor } from "src/common/interceptors/processResponseData.interceptor";
import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { LoggedInGuard } from "src/auth/logged-in-guard";
import { NotLoggedInGuard } from "src/auth/not-logged-in-guard";
import { User } from "src/entities/user.entity";
import { UserDecorator } from "src/common/decorators/user.decorator";
import { LogInUserDto } from "./dto/login-user.dto";

@UseInterceptors(ProcessResponseDataInterceptor)
@ApiTags("USER")
@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "로그인" })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  logIn(@Body() user: LogInUserDto) {
    return user;
  }

  @ApiCookieAuth("connect.sid")
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
  @Post()
  async join(@Body() createUserDto: JoinUserDto) {
    const result = await this.usersService.join(
      createUserDto.email,
      createUserDto.nickname,
      createUserDto.password
    );

    if (result) {
      return "ok";
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiCookieAuth("connect.sid")
  @ApiOperation({ summary: "내 정보 조회" })
  @Get()
  async getProfile(@UserDecorator() user: User) {
    return user || false;
  }
}
