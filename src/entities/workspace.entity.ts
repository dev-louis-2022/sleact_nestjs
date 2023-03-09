import { Channel } from "./channel.entity";
import { CUDDate } from "../common/entities/CUDDate.entity";
import { Dm } from "./dm.entity";
import { Mention } from "./mention.entity";
import { User } from "./user.entity";
import { WorkspaceMember } from "./workspace-member.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

@Index("ownerId", ["ownerId"], {})
@Entity({ schema: "sleact", name: "workspace" })
export class Workspace extends CUDDate {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @IsString()
  @ApiProperty({
    example: "workspace-0001@workspace.com",
    description: "워크스페이스 URL",
  })
  @Column({ type: "varchar", name: "url" })
  url: string;

  @IsString()
  @MaxLength(20)
  @ApiProperty({
    example: "워크스페이스(회사)",
    description: "워크스페이스 이름",
  })
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
