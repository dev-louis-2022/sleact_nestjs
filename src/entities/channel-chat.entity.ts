import { Channel } from "./channel.entity";
import { CUDate } from "../common/entities/CUDate.entity";
import { Mention } from "./mention.entity";
import { User } from "./user.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Index("channelId", ["channelId"], {})
@Index("userId", ["userId"], {})
@Entity({ schema: "sleact", name: "channelChat" })
export class ChannelChat extends CUDate {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;
  @Column({ type: "int", name: "channelId" })
  channelId: number;
  @Column({ type: "int", name: "userId" })
  userId: number;

  @ApiProperty({
    required: true,
    description: "채팅 메세지",
  })
  @IsString()
  @IsNotEmpty()
  @Column({ type: "text", name: "content" })
  content: string;

  @ManyToOne(() => Channel, (channel) => channel.Chats, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "channelId", referencedColumnName: "id" }])
  Channel: Channel;

  @ManyToOne(() => User, (user) => user.ChannelChats, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  User: User;

  @OneToMany(() => Mention, (mention) => mention.Chat)
  Mentions: Mention[];
}
