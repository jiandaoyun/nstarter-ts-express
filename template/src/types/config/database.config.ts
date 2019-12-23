//#module mongodb
import { IBaseConf } from './base.config';

interface MongodbServer {
    readonly host: string;
    readonly port: number;
}

interface IX509Config {
    readonly ca: string;
    readonly cert: string;
    readonly key: string;
}

export interface MongodbConfig {
    readonly mongod?: MongodbServer;
    readonly mongos?: MongodbServer[];
    readonly user?: string;
    readonly password?: string;
    readonly x509?: IX509Config;
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
    // 链接配置
    readonly heartbeatInterval?: number;
    readonly reconnectInterval?: number;
}
//#endmodule rabbitmq

export interface IDatabaseConf extends IBaseConf {
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
