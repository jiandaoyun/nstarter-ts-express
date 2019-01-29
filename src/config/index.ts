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
    readonly server: {
        readonly http: {
            readonly port: number;
        };
        readonly static: {
            readonly views: string;
            readonly public: string;
        };
        readonly session: {
            readonly secret: string;
            readonly name: string;
        };
        readonly cookie: {
            readonly secret: string;
            readonly policy: {
                readonly httpOnly: boolean
                readonly maxAge?: number
                readonly signed: boolean
                readonly secure: boolean
                readonly domain?: string
            };
        }
    };
    readonly database: DatabaseConfig;
    readonly system: {
        readonly locale: string;
    }
}

class Config implements ConfigInterface {
    private static _instance = new Config();
    private readonly _config: ConfigInterface;

    constructor () {
        const config = require('../../config/config.default.json');
        this._config = config;
    }

    public get server() {
        return this._config.server;
    }

    public get database() {
        return this._config.database;
    }

    public get system() {
        return this._config.system;
    }

    public static getInstance(): Config {
        return Config._instance;
    }
}

export const config = Config.getInstance();
