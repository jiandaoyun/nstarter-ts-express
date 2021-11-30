import nconf from 'nconf';
import _ from 'lodash';
import fs from 'fs';
import os from 'os';
import { RunEnv } from 'nstarter-core';
import { dump, load } from 'js-yaml';
import { Config } from './entities/config';
import './schema';
import path from 'path';

export const pkg = JSON.parse(
    fs.readFileSync('./package.json', 'utf8')
);

const configFormat: Record<string, nconf.IFormat> = {
    yml: {
        parse: (str: string) => load(str),
        stringify: (obj: object) => dump(obj)
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
        const homePath = nconf.any(['USERPROFILE', 'HOME']);
        // 加载本地可选配置文件 (最高优先级)
        this._loadConf(path.join(homePath, '.ns-app/config'), 'local');
        // 加载配置文件
        this._loadConf(`./conf.d/config`, env);

        try {
            this._conf = new Config({
                env,
                hostname: os.hostname(),
                version: pkg.version,
                home_path: homePath,
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
            // 对于单一环境仅加载一种配置
            return false;
        });
    }
}

export const config = new ConfigLoader().getConfig();
