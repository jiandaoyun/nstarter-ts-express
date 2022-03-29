import nconf from 'nconf';
import _ from 'lodash';
import fs from 'fs';
import os from 'os';
import { RunEnv } from 'nstarter-core';
import { dump, load } from 'js-yaml';
import { Config } from './entities/config';
import './schema';
import path from 'path';
import { EventEmitter } from 'events';

export const pkg = JSON.parse(
    fs.readFileSync('./package.json', 'utf8')
);
pkg.version = _.trim(fs.readFileSync('./VERSION', 'utf-8'));

const configFormat: Record<string, nconf.IFormat> = {
    yml: {
        parse: (str: string) => load(str),
        stringify: (obj: object) => dump(obj)
    },
    json: nconf.formats.json
};

/**
 * 事件定义
 */
export declare interface ConfigLoader {
    on: ((event: 'reload', listener: (config: Config) => void) => this);
}

/**
 * 配置装载器
 */
export class ConfigLoader extends EventEmitter {
    private readonly _conf: Config = new Config();

    // 运行时环境
    private readonly _runEnv = RunEnv[
        nconf.get('NODE_ENV') as keyof typeof RunEnv] || RunEnv.develop;
    private readonly _homePath = os.homedir();

    // 已加载配置文件集合
    private _loadedConfFileSet: Set<string> = new Set();
    // 加载中状态标志
    private _isLoading = false;
    private _loadLockTimeMs = 100;

    // 配置文件列表
    private readonly _configFiles = [
        // 加载本地可选配置文件 (最高优先级)
        path.join(this._homePath, '.ns-app/config'),
        // 加载配置文件
        './conf.d/config'
    ];

    /**
     * @constructor
     */
    constructor() {
        super();
        nconf.use('memory');
        try {
            this.loadConfig();
        } catch (err) {
            // 初始加载失败，退出服务
            process.exit(1);
        }
        this.watchConfigChange();
    }

    /**
     * 加载配置内容
     */
    public loadConfig() {
        // 状态控制，消除抖动
        if (this._isLoading) {
            return;
        }
        this._isLoading = true;

        nconf.reset();
        nconf.env();

        // 加载配置文件
        _.forEach(this._configFiles, (configPath, idx) => {
            this._loadConfFile(configPath, `config_${ idx }`);
        });
        try {
            this._conf.fromJSON({
                env: this._runEnv,
                hostname: os.hostname(),
                version: pkg.version,
                home_path: this._homePath,
                ...nconf.get()
            });
        } catch (err) {
            // 配置阶段 logger 未完成初始化
            console.error('Invalid config file, please check.');
            console.error(err.message);
            throw err;
        } finally {
            // 消除加载抖动
            setTimeout(() => {
                this._isLoading = false;
            }, this._loadLockTimeMs);
        }
    }

    /**
     * 监听配置文件变更
     */
    public watchConfigChange() {
        this._loadedConfFileSet.forEach((configPath) => {
            fs.watch(configPath, () => {
                if (this._isLoading) {
                    return;
                }
                // note: 本地文件系统会发生 change 事件，k8s 内会发生 rename 事件
                console.log(`Config file changed: ${ configPath }`);
                try {
                    this.loadConfig();
                    // 成功加载后，触发加载完成事件
                    this.emit('reload', [this.getConfig()]);
                } catch (err) {
                    console.error('Config file reload failed, please check.');
                    console.error(err.message);
                }
            });
        });
    }

    /**
     * 获取配置内容
     */
    public getConfig() {
        return this._conf;
    }

    /**
     * 加载配置文件内容
     * @param path - 配置文件路径
     * @param key - 配置文件标识
     * @private
     */
    private _loadConfFile(path: string, key: string): void {
        _.forEach(configFormat, (format, type) => {
            const file = `${ path }.${ type }`;
            if (!fs.existsSync(file)) {
                return;
            }
            console.log(`Loading config: "${ file }"`);
            nconf.file(key, { file, format });
            this._loadedConfFileSet.add(file);
            // 对于单一环境仅加载一种配置
            return false;
        });
    }
}

export const config = new ConfigLoader().getConfig();
