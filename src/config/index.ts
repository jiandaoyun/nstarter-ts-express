export type MongodbConfig = {
    readonly mongod: {
        readonly host: string,
        readonly port: number
    };
    readonly user: string;
    readonly password: string;
    readonly db: string;
};

export type RedisConfig = {
    readonly host: string;
    readonly port: number;
    readonly name: string;
    readonly password: string;
};

type DatabaseConfig = {
    readonly mongodb: MongodbConfig;
    readonly redis: RedisConfig;
};

interface ConfigInterface {
    readonly database: DatabaseConfig;
}

class Config implements ConfigInterface {
    private static _instance = new Config();
    private readonly _config: ConfigInterface;

    constructor () {
        const config = require('../../config/config.example.json');
        this._config = config;
    }

    get database() {
        return this._config.database;
    }

    static getInstance(): Config {
        return Config._instance;
    }
}

export const config = Config.getInstance();
