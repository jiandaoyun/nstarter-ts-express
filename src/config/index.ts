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

interface ConfigInterface {
    readonly server: ServerConfig;
    readonly database: DatabaseConfig;
    readonly system: SystemConfig;
    readonly service: ServiceConfig;
}

const configFormat: Record<string, nconf.IFormat> = {
    yaml: {
        parse: (str: string) => safeLoad(str),
        stringify: (obj: object) => safeDump(obj)
    },
    json: nconf.formats.json
};

class Config implements ConfigInterface {
    public readonly hostname = os.hostname();
    public readonly version = pkg.version;
    public readonly env: RunEnv;
    public readonly homePath: string;

    constructor () {
        nconf.use('memory');
        nconf.env();
        this.env = RunEnv[nconf.get('NODE_ENV') as keyof typeof RunEnv] || RunEnv.dev;
        this.homePath = nconf.any(['USERPROFILE', 'HOME']);
        // load config by environment
        this._loadConf(`./conf.d/config.${ this.env }`, this.env);
        // load default config
        this._loadConf('./conf.d/config.default', 'default');
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

    public get server() {
        return nconf.get('server');
    }

    public get database() {
        return nconf.get('database');
    }

    public get system() {
        return nconf.get('system');
    }

    public get service() {
        return nconf.get('service');
    }
}

export const config = new Config();
