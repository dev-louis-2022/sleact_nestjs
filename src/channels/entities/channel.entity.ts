import { ChannelChat } from '../../channel-chats/entities/channel-chat.entity';
import { ChannelMember } from '../../channel-members/entities/channel-member.entity';
import { CUDDate } from '../../common/entities/CUDDate.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import {
  Column,
  Index,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Index('workspaceId', ['workspaceId'], {})
@Entity({ schema: 'sleact', name: 'channel' })
export class Channel extends CUDDate {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 30 })
  name: string;

  @Column({
    type: 'tinyint',
    name: 'private',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  private: boolean | null;

  @Column({ type: 'int', name: 'workspaceId', nullable: true })
  workspaceId: number | null;

  @ManyToOne(() => Workspace, (workspace) => workspace.Channels, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspaceId', referencedColumnName: 'id' }])
  Workspace: Workspace;

  @OneToMany(() => ChannelMember, (channelMember) => channelMember.Channel)
  Members: ChannelMember[];

  @OneToMany(() => ChannelChat, (channelChat) => channelChat.Channel)
  Chats: ChannelChat[];
}
