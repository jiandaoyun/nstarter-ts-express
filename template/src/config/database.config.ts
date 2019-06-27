//#module mongodb
export interface MongodbConfig {
    readonly mongod: {
        readonly host: string,
        readonly port: number
    };
    readonly user?: string;
    readonly password?: string;
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

//#module rabbitmq
export interface RabbitMQParams {
    readonly heartbeat?: number;
    readonly frameMax?: number;
    readonly channelMax?: number;
    readonly locale?: string;
}
export interface RabbitMQConfig {
    readonly brokers: {
        readonly host: string;
        readonly port: number;
    }[];
    readonly protocol: string;
    readonly user: string;
    readonly password: string;
    readonly vhost: string;
    readonly params: RabbitMQParams

}
//#endmodule rabbitmq

export interface DatabaseConfig {
    //#module mongodb
    readonly mongodb: MongodbConfig;
    //#endmodule mongodb
    //#module redis
    readonly redis: RedisConfig;
    //#endmodule redis
    //#module rabbitmq
    readonly rabbitmq: RabbitMQConfig;
    //#endmodule rabbitmq
}
