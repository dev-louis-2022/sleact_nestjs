import { Channel } from '../../channels/entities/channel.entity';
import { CUDate } from '../../common/entities/CUDate.entity';
import { Mention } from '../../mentions/entities/mention.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'sleact', name: 'channelChat' })
export class ChannelChat extends CUDate {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;
  @Column({ type: 'int', name: 'channelId' })
  channelId: number;
  @Column({ type: 'int', name: 'userId' })
  userId: number;
  @Column({ type: 'text', name: 'content' })
  content: string;

  @ManyToOne(() => Channel, (channel) => channel.Chats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'channelId', referencedColumnName: 'id' }])
  Channel: Channel;

  @ManyToOne(() => User, (user) => user.ChannelChats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  User: User;

  @OneToMany(() => Mention, (mention) => mention.Chat)
  Mentions: Mention[];
}
