import _ from 'lodash';
import os from 'os';
import fs from 'fs';
import nconf from 'nconf';
import { safeLoad, safeDump } from 'js-yaml';

import { DatabaseConfig } from './config.database';
import { ServerConfig } from './config.server';
import { ServiceConfig } from './config.service';
import { SystemConfig } from './config.system';
import { pkg } from './pkg';

enum RunEnv {
    dev = 'develop',
    test = 'test',
    prod = 'production'
}

const configFormat: Record<string, nconf.IFormat> = {
    yaml: {
        parse: (str: string) => safeLoad(str),
        stringify: (obj: object) => safeDump(obj)
    },
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
