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

@Index("userId", ["userId"], {})
@Index("workspaceId", ["workspaceId"], {})
@Entity({ schema: "sleact", name: "workspaceMember" })
export class WorkspaceMember extends CUDate {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;
  @Column({ type: "int", name: "userId" })
  userId: number;
  @Column({ type: "int", name: "workspaceId" })
  workspaceId: number;
  @Column({ type: "date", name: "loggedInAt", nullable: true })
  loggedInAt: Date;

  @ManyToOne(() => User, (user) => user.WorkspaceMembers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  User: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.Members, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "workspaceId", referencedColumnName: "id" }])
  Workspace: Workspace;
}
