import { ValidateFunction } from 'ajv';

import { Types } from '../entity.ajv';
import { BaseEntity } from '../entity.base';
import { ServerConfig } from './server.config';
import { SystemConfig } from './system.config';
import { DatabaseConfig } from './database.config';
import { ComponentsConfig } from './components.config';
import { RunEnv } from '../../enums/config.enum';
import { IConfig } from '../../types/config';

let validator: ValidateFunction = () => true;

export class ConfigEntity extends BaseEntity<IConfig> {
    protected _validate = validator;

    protected _schema = {
        // Base attributes
        env: Types.string({
            enum: RunEnv
        }),
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
