import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MorganModule } from "nest-morgan";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MorganInterceptor } from "nest-morgan/morgan.interceptor.mixin";
import { UsersModule } from "./users/users.module";
import { WorkspacesModule } from "./workspaces/workspaces.module";
import { ChannelsModule } from "./channels/channels.module";
import { DmsModule } from "./dms/dms.module";

import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Dm } from "./entities/dm.entity";
import { Channel } from "./entities/channel.entity";
import { Workspace } from "./entities/workspace.entity";
import { MentionsModule } from "./mentions/mentions.module";
import { ChannelChat } from "./entities/channel-chat.entity";
import { ChannelMember } from "./entities/channel-member.entity";
import { Mention } from "./entities/mention.entity";
import { WorkspaceMember } from "./entities/workspace-member.entity";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MorganModule,
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    MentionsModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        ChannelChat,
        ChannelMember,
        Channel,
        Dm,
        Mention,
        User,
        WorkspaceMember,
        Workspace,
      ],
      synchronize: false,
      migrations: [__dirname, "/src/migrations/*.ts"],
      charset: "utf8mb4_general_ci",
      logging: true,
      keepConnectionAlive: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined"),
    },
    {
      provide: "CUSTOM_KEY",
      useValue: "CUSTOM_VALUE",
    },
  ],
})
export class AppModule {}
