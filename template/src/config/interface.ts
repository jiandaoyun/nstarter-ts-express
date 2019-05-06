import { DatabaseConfig } from './database.config';
import { ServerConfig } from './server.config';
import { ComponentsConfig } from './components.config';
import { SystemConfig } from './system.config';

export interface ConfigType {
    readonly server: ServerConfig;
    readonly database: DatabaseConfig;
    readonly system: SystemConfig;
    readonly components: ComponentsConfig;
}
