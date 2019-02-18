//#module mongodb
export interface MongodbConfig {
    readonly mongod: {
        readonly host: string,
        readonly port: number
    };
    readonly user: string;
    readonly password: string;
    readonly db: string;
}
//#endmodule mongodb

//#module redis
export interface RedisConfig {
    readonly host: string;
    readonly port: number;
    readonly name: string;
    readonly password: string;
}
//#endmodule redis

export interface DatabaseConfig {
    //#module mongodb
    readonly mongodb: MongodbConfig;
    //#endmodule mongodb
    //#module redis
    readonly redis: RedisConfig;
    //#endmodule redis
}
