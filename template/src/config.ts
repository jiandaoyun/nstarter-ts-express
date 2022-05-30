import _ from 'lodash';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { RunEnv } from 'nstarter-core';
import { ConfigLoader, ConfigLoadEvents } from 'nstarter-config';
import { Config } from './entities/config';
import './schema';

const homePath = os.homedir();
const version = _.trim(fs.readFileSync('./VERSION', 'utf-8'));
const runEnv = RunEnv[process.env.NODE_ENV as keyof typeof RunEnv] || RunEnv.develop;

const loader = new ConfigLoader<Config>(Config, {
    files: [
        // 加载本地可选配置文件 (最高优先级)
        path.join(homePath, '.ns-app/config'),
        // 加载配置文件
        './conf.d/config'
    ],
    useHotReload: true,
    useIncludes: true,
    extra: {
        env: runEnv,
        hostname: os.hostname(),
        version,
        home_path: homePath,
    }
});

loader.on(ConfigLoadEvents.init_failed, (err: Error) => {
    process.exit(1);
});

export const config = loader.initialize().getConfig();
