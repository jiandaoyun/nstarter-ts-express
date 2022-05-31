import { AbstractEntity } from 'nstarter-entity';

import { IServerConf } from './server.config';
import { IStorageConf } from './storage.config';
import { ISystemConf } from './system.config';
import { IComponentsConf } from './components.config';

/**
 * 配置对象实体
 */
export class Config extends AbstractEntity {
    env: string;
    hostname: string;
    version: string;
    includes?: string[];

    server: IServerConf;
    storage: IStorageConf;
    system: ISystemConf;
    components: IComponentsConf;
}

export {
    IServerConf,
    IStorageConf,
    ISystemConf,
    IComponentsConf
};
