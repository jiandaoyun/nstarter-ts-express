import { AbstractEntity } from 'nstarter-entity';

import { IServerConf } from './server.config';
import { IDatabaseConf } from './database.config';
import { ISystemConf } from './system.config';
import { IComponentsConf } from './components.config';

/**
 * 配置对象实体
 */
export class Config extends AbstractEntity {
    env: string;
    hostname: string;
    version: string;
    home_path: string;

    server: IServerConf;
    database: IDatabaseConf;
    system: ISystemConf;
    components: IComponentsConf;
}

export {
    IServerConf,
    IDatabaseConf,
    ISystemConf,
    IComponentsConf
};
