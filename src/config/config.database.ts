export interface MongodbConfig {
    readonly mongod: {
        readonly host: string,
        readonly port: number
    };
    readonly user: string;
    readonly password: string;
    readonly db: string;
}

export interface RedisConfig {
    readonly host: string;
    readonly port: number;
    readonly name: string;
    readonly password: string;
}

export interface DatabaseConfig {
    readonly mongodb: MongodbConfig;
    readonly redis: RedisConfig;
}
