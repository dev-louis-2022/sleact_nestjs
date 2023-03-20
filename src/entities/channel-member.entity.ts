import { Channel } from "./channel.entity";
import { CUDate } from "../common/entities/CUDate.entity";
import { User } from "./user.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("channelId", ["channelId"], {})
@Index("userId", ["userId"], {})
@Entity({ schema: "sleact", name: "channelMember" })
export class ChannelMember extends CUDate {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;
  @Column({ type: "int", name: "userId" })
  userId: number;
  @Column({ type: "int", name: "channelId" })
  channelId: number;

  @ManyToOne(() => User, (user) => user.ChannelMembers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "userId", referencedColumnName: "id" }])
  User: User;

  @ManyToOne(() => Channel, (channel) => channel.Members, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "channelId", referencedColumnName: "id" }])
  Channel: Channel;
}
