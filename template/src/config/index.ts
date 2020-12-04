import nconf from 'nconf';
import _ from 'lodash';
import fs from 'fs';
import os from 'os';
import { RunEnv } from 'nstarter-core';
import { safeDump, safeLoad } from 'js-yaml';
import { baseConf } from './base_conf';
import { Config } from '../entities/config';

export const pkg = JSON.parse(
    fs.readFileSync('./package.json', 'utf8')
);

const configFormat: Record<string, nconf.IFormat> = {
    yml: {
        parse: (str: string) => safeLoad(str),
        stringify: (obj: object) => safeDump(obj)
    },
    json: nconf.formats.json
};

/**
 * 配置装载器
 */
export class ConfigLoader {
    private readonly _conf: Config;

    constructor() {
        nconf.use('memory');
        nconf.env();
        const env = RunEnv[nconf.get('NODE_ENV') as keyof typeof RunEnv] || RunEnv.develop;
        // load config by environment
        this._loadConf(`./conf.d/config.${ env }`, env);
        // load default config
        nconf.defaults(baseConf);

        try {
            this._conf = new Config({
                env,
                hostname: os.hostname(),
                version: pkg.version,
                home_path: nconf.any(['USERPROFILE', 'HOME']),
                ...nconf.get()
            });
        } catch (err) {
            // 配置阶段 logger 未完成初始化
            console.error('Invalid config file, please check.');
            console.error(err.message);
            process.exit(1);
        }
    }

    public getConfig() {
        return this._conf;
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
