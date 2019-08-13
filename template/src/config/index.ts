import nconf from 'nconf';
import _ from 'lodash';
import fs from 'fs';
import os from 'os';
import { safeDump, safeLoad } from 'js-yaml';
import { baseConf } from './base_conf';
import { ConfigEntity } from '../entities/config';
import { RunEnv } from '../enums/config.enum';

export const pkg = JSON.parse(
    fs.readFileSync('./package.json', 'utf8')
);

const configFormat: Record<string, nconf.IFormat> = {
    //#module conf_yaml
    yml: {
        parse: (str: string) => safeLoad(str),
        stringify: (obj: object) => safeDump(obj)
    },
    //#endmodule conf_yaml
    json: nconf.formats.json
};

export class ConfigLoader {
    private _conf: ConfigEntity;

    constructor() {
        nconf.use('memory');
        nconf.env();
        const env = RunEnv[nconf.get('NODE_ENV') as keyof typeof RunEnv] || RunEnv.dev;
        // load config by environment
        this._loadConf(`./conf.d/config.${ env }`, env);
        // load default config
        nconf.defaults(baseConf);

        this._conf = new ConfigEntity();
        this._conf.setConfig({
            env,
            hostname: os.hostname(),
            version: pkg.version,
            home_path: nconf.any(['USERPROFILE', 'HOME']),
            ...nconf.get()
        });
        if (!this._conf.isConfValid) {
            console.error('Invalid config, please check.');
            console.error(this._conf.validationErrors);
            process.exit(1);
        }
    }

    public getConfig() {
        return this._conf.getConfig();
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

export const config = new ConfigLoader().getConfig();
