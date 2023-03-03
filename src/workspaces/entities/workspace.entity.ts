import { Channel } from "../../channels/entities/channel.entity";
import { CUDDate } from "../../common/entities/CUDDate.entity";
import { Dm } from "../../dms/entities/dm.entity";
import { Mention } from "../../mentions/entities/mention.entity";
import { User } from "../../users/entities/user.entity";
import { WorkspaceMember } from "../../workspace-members/entities/workspace-member.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("ownerId", ["ownerId"], {})
@Entity({ schema: "sleact", name: "workspace" })
export class Workspace extends CUDDate {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;
  @Column({ type: "varchar", name: "url" })
  url: string;
  @Column({ type: "varchar", name: "name" })
  name: string;
  @Column({ type: "int", name: "ownerId", nullable: true })
  ownerId: number;

  @ManyToOne(() => User, (user) => user.OwnerWorkspaces, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "ownerId", referencedColumnName: "id" }])
  Owner: User;

  @OneToMany(() => Channel, (channel) => channel.Workspace)
  Channels: Channel[];

  @OneToMany(() => Dm, (dm) => dm.Workspace)
  Dms: Dm[];

  @OneToMany(() => Mention, (mention) => mention.Workspace)
  Mentions: Mention[];

  @OneToMany(
    () => WorkspaceMember,
    (workspaceMember) => workspaceMember.Workspace
  )
  Members: WorkspaceMember[];
}
