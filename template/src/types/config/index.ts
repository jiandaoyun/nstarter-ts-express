import { IEntityConf } from '../entities';

import { IBaseConf } from './base.config';
import { IServerConf } from './server.config';
import { IDatabaseConf } from './database.config';
import { ISystemConf } from './system.config';
import { IComponentsConf } from './components.config';

export interface IConfigParams extends IEntityConf {
    server: IServerConf;
    database: IDatabaseConf;
    system: ISystemConf;
    components: IComponentsConf;
}

export interface IConfig extends IConfigParams {
    env: string;
    hostname: string;
    version: string;
    home_path: string;
}

export {
    IBaseConf,
    IServerConf,
    IDatabaseConf,
    ISystemConf,
    IComponentsConf
};
