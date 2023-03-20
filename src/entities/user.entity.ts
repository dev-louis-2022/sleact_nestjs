import { ApiProperty } from "@nestjs/swagger";
import { ChannelChat } from "./channel-chat.entity";
import { ChannelMember } from "./channel-member.entity";
import { CUDDate } from "../common/entities/CUDDate.entity";
import { Dm } from "./dm.entity";
import { Mention } from "./mention.entity";
import { WorkspaceMember } from "./workspace-member.entity";
import { Workspace } from "./workspace.entity";
import {
  Column,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";
import { IsEmail } from "class-validator";

@Unique("email", ["email"], {})
@Entity({ schema: "sleact", name: "user" })
export class User extends CUDDate {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @IsEmail()
  @ApiProperty({
    example: "test@test.com",
    description: "이메일",
  })
  @Column({ type: "varchar", name: "email", unique: true, length: 30 })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: "nickname",
    description: "닉네임",
  })
  @Column({ type: "varchar", name: "nickname", length: 30 })
  nickname: string;

  @ApiProperty({
    example: "xxxxxxxxxxxxx",
    description: "비밀번호",
  })
  @Column({ type: "varchar", name: "password", length: 100 })
  password: string;

  @OneToMany(() => Dm, (dm) => dm.Sender)
  SendedDms: Dm[];

  @OneToMany(() => Dm, (dm) => dm.Receiver)
  ReceivedDms: Dm[];

  @OneToMany(() => Workspace, (workspace) => workspace.Owner)
  OwnerWorkspaces: Workspace[];

  @OneToMany(() => Mention, (mention) => mention.Sender)
  SendedMention: Mention[];

  @OneToMany(() => Mention, (mention) => mention.Receiver)
  ReceivedMention: Mention[];

  @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.User)
  WorkspaceMembers: WorkspaceMember[];

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.User)
  ChannelMembers: ChannelMember[];

  @OneToMany(() => ChannelChat, (channelChat) => channelChat.User)
  ChannelChats: ChannelChat[];
}
