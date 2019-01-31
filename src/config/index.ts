import os from 'os';
import { DatabaseConfig } from './config.database';
import { ServerConfig } from './config.server';
import { ServiceConfig } from './config.service';
import { SystemConfig } from './config.system';

enum RunEnv {
    local = 'local',
    test = 'test',
    production = 'production'
}

interface ConfigInterface {
    readonly server: ServerConfig;
    readonly database: DatabaseConfig;
    readonly system: SystemConfig;
    readonly service: ServiceConfig;
}

class Config implements ConfigInterface {
    private static _instance = new Config();
    private readonly _config: ConfigInterface;

    constructor () {
        const config = require('../../config/config.default.json');
        this._config = config;
    }

    public readonly hostname = os.hostname();

    public get server() {
        return this._config.server;
    }

    public get database() {
        return this._config.database;
    }

    public get system() {
        return this._config.system;
    }

    public get service() {
        return this._config.service;
    }

    public static getInstance(): Config {
        return Config._instance;
    }
}

export const config = Config.getInstance();
