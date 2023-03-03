import { ChannelChat } from '../../channel-chats/entities/channel-chat.entity';
import { CUDDate } from '../../common/entities/CUDDate.entity';
import { User } from '../../users/entities/user.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'sleact', name: 'mention' })
export class Mention extends CUDDate {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;
  @Column({ type: 'enum', name: 'category', enum: ['chat', 'dm', 'system'] })
  type: 'chat' | 'dm' | 'system';
  @Column({ type: 'int', name: 'chatId', nullable: true })
  chatId: number | null;
  @Column({ type: 'int', name: 'workspaceId', nullable: true })
  workspaceId: number | null;
  @Column({ type: 'int', name: 'senderId', nullable: true })
  senderId: number | null;
  @Column({ type: 'int', name: 'receiverId', nullable: true })
  receiverId: number | null;

  @ManyToOne(() => Workspace, (workspace) => workspace.Mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'workspaceId', referencedColumnName: 'id' }])
  Workspace: Workspace;

  @ManyToOne(() => User, (user) => user.SendedMention, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'senderId', referencedColumnName: 'id' }])
  Sender: User;

  @ManyToOne(() => User, (user) => user.ReceivedMention, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'receiverId', referencedColumnName: 'id' }])
  Receiver: User;

  @ManyToOne(() => ChannelChat, (channelChat) => channelChat.Mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'chatId', referencedColumnName: 'id' }])
  Chat: ChannelChat;
}
