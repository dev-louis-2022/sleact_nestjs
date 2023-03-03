import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './src/users/entities/user.entity';
import { Dm } from './src/dms/entities/dm.entity';
import { Channel } from './src/channels/entities/channel.entity';
import { Workspace } from './src/workspaces/entities/workspace.entity';
import { ChannelChat } from './src/channel-chats/entities/channel-chat.entity';
import { ChannelMember } from './src/channel-members/entities/channel-member.entity';
import { Mention } from './src/mentions/entities/mention.entity';
import { WorkspaceMember } from './src/workspace-members/entities/workspace-member.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    ChannelChat,
    ChannelMember,
    Channel,
    Dm,
    Mention,
    User,
    WorkspaceMember,
    Workspace,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  charset: 'utf8mb4_general_ci',
  synchronize: false,
  logging: true,
});

export default dataSource;
