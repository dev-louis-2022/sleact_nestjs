import { Channel } from '../../channels/entities/channel.entity';
import { CUDate } from '../../common/entities/CUDate.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'sleact', name: 'channelMember' })
export class ChannelMember extends CUDate {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;
  @Column({ type: 'int', name: 'userId' })
  userId: number;
  @Column({ type: 'int', name: 'channelId' })
  channelId: number;

  @ManyToOne(() => User, (user) => user.Channels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  User: User;

  @ManyToOne(() => Channel, (channel) => channel.Members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'channelId', referencedColumnName: 'id' }])
  Channel: Channel;
}
