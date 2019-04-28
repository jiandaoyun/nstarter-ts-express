import _ from 'lodash';
import os from 'os';
import fs from 'fs';
import nconf from 'nconf';
//#module conf_yaml
import { safeLoad, safeDump } from 'js-yaml';
//#endmodule conf_yaml

import { DatabaseConfig } from './database.config';
import { ServerConfig } from './server.config';
import { ServiceConfig } from './service.config';
import { ComponentsConfig } from './components.config';
import { SystemConfig } from './system.config';
import { pkg } from './pkg';

enum RunEnv {
    dev = 'develop',
    test = 'test',
    prod = 'production'
}

const configFormat: Record<string, nconf.IFormat> = {
    //#module conf_yaml
    yml: {
        parse: (str: string) => safeLoad(str),
        stringify: (obj: object) => safeDump(obj)
    },
    //#endmodule conf_yaml
    json: nconf.formats.json
};

class Config {
    public readonly hostname = os.hostname();
    public readonly version = pkg.version;
    public readonly env: RunEnv;
    public readonly homePath: string;

    public readonly server: ServerConfig;
    public readonly database: DatabaseConfig;
    public readonly system: SystemConfig;
    public readonly components: ComponentsConfig;
    public readonly service: ServiceConfig;

    constructor () {
        nconf.use('memory');
        nconf.env();
        this.env = RunEnv[nconf.get('NODE_ENV') as keyof typeof RunEnv] || RunEnv.dev;
        this.homePath = nconf.any(['USERPROFILE', 'HOME']);
        this._loadConf('./conf.d/config.override', 'override');
        // load config by environment
        this._loadConf(`./conf.d/config.${ this.env }`, this.env);
        // load default config
        this._loadConf('./conf.d/config.default', 'default');

        // init config
        this.server = nconf.get('server');
        this.database = nconf.get('database');
        this.system = nconf.get('system');
        this.components = nconf.get('components');
        this.service = nconf.get('service');
    }

    private _loadConf(path: string, env: string): void {
        _.forEach(configFormat, (format, type) => {
            const file = `${ path }.${ type }`;
            if (!fs.existsSync(file)) {
                return;
            }
            console.log(`Loading ${ env } config: "${ file }"`);
            nconf.file(env, { file, format });
            // only load same env for one format
            return false;
        });
    }
}

export const config = new Config();
