import { CUDate } from "../common/entities/CUDate.entity";
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

@Index("workspaceId", ["workspaceId"], {})
@Index("senderId", ["senderId"], {})
@Index("receiverId", ["receiverId"], {})
@Entity({ schema: "sleact", name: "dm" })
export class Dm extends CUDate {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;
  @Column({ type: "text", name: "content" })
  content: string;
  @Column({ type: "int", name: "workspaceId", nullable: true })
  workspaceId: number | null;
  @Column({ type: "int", name: "senderId", nullable: true })
  senderId: number | null;
  @Column({ type: "int", name: "receiverId", nullable: true })
  receiverId: number | null;

  @ManyToOne(() => User, (user) => user.SendedDms, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "senderId", referencedColumnName: "id" }])
  Sender: User;

  @ManyToOne(() => User, (user) => user.ReceivedDms, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "receiverId", referencedColumnName: "id" }])
  Receiver: User;

  @JoinColumn([{ name: "workspaceId", referencedColumnName: "id" }])
  Workspace: Workspace;
}
