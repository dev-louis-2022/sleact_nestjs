import { Channel } from '../../channels/entities/channel.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';
import { Seeder } from 'typeorm-extension';
import { SeederFactoryManager } from 'typeorm-extension/dist/seeder';
import { DataSource } from 'typeorm/data-source';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const workspacesRepository = dataSource.getRepository(Workspace);
    await workspacesRepository.insert([
      {
        id: 1,
        name: 'Sleact',
        url: 'sleact',
      },
    ]);
    const channelsRepository = dataSource.getRepository(Channel);
    await channelsRepository.insert([
      {
        id: 1,
        name: '일반',
        workspaceId: 1,
        private: false,
      },
    ]);
  }
}
