import { ValidateFunction } from 'ajv';

import { Types } from '../entity.ajv';
import { BaseEntity, IEntityConf } from '../entity.base';
import { ServerConfig } from './server.config';
import { SystemConfig } from './system.config';
import { DatabaseConfig } from './database.config';
import { ComponentsConfig } from './components.config';
import { IDatabaseConf } from '../../types/config/database.config';
import { IServerConf } from '../../types/config/server.config';
import { ISystemConf } from '../../types/config/system.config';
import { IComponentsConf } from '../../types/config/components.config';

let validator: ValidateFunction = () => true;

export interface IConfig extends IEntityConf {
    env?: string;
    hostname?: string;
    version?: string;
    home_path?: string;

    server: IServerConf;
    database: IDatabaseConf;
    system: ISystemConf;
    components: IComponentsConf;
}

export class ConfigEntity extends BaseEntity<IConfig> {
    protected _validate = validator;

    protected _schema = {
        // Base attributes
        env: Types.string({ }),
        hostname: Types.string(),
        version: Types.string(),
        home_path: Types.string(),
        // Configurations
        server: Types.object({}, {
            model: ServerConfig
        }),
        database: Types.object({}, {
            model: DatabaseConfig
        }),
        system: Types.object({}, {
            model: SystemConfig
        }),
        components: Types.object({}, {
            model: ComponentsConfig
        })
    };
}

validator = new ConfigEntity().validator;
