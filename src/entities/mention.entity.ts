import { ChannelChat } from "./channel-chat.entity";
import { CUDDate } from "../common/entities/CUDDate.entity";
import { User } from "./user.entity";
import { Workspace } from "./workspace.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("chatId", ["chatId"], {})
@Index("workspaceId", ["workspaceId"], {})
@Index("senderId", ["senderId"], {})
@Index("receiverId", ["receiverId"], {})
@Entity({ schema: "sleact", name: "mention" })
export class Mention extends CUDDate {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;
  @Column({ type: "enum", name: "category", enum: ["chat", "dm", "system"] })
  type: "chat" | "dm" | "system";
  @Column({ type: "int", name: "chatId", nullable: true })
  chatId: number | null;
  @Column({ type: "int", name: "workspaceId", nullable: true })
  workspaceId: number | null;
  @Column({ type: "int", name: "senderId", nullable: true })
  senderId: number | null;
  @Column({ type: "int", name: "receiverId", nullable: true })
  receiverId: number | null;

  @ManyToOne(() => Workspace, (workspace) => workspace.Mentions, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "workspaceId", referencedColumnName: "id" }])
  Workspace: Workspace;

  @ManyToOne(() => User, (user) => user.SendedMention, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "senderId", referencedColumnName: "id" }])
  Sender: User;

  @ManyToOne(() => User, (user) => user.ReceivedMention, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "receiverId", referencedColumnName: "id" }])
  Receiver: User;

  @ManyToOne(() => ChannelChat, (channelChat) => channelChat.Mentions, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "chatId", referencedColumnName: "id" }])
  Chat: ChannelChat;
}
