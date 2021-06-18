//#module mongodb
import { IMongodbConfig } from 'nstarter-mongodb';
//#endmodule mongodb

//#module redis
export interface IRedisConfig {
    /**
     * 服务器地址
     */
    readonly host: string;

    /**
     * 端口
     * @type number
     * @minimum 1
     * @maximum 65535
     * @default 6379
     */
    readonly port?: number;
    readonly name: string;
    readonly password: string;

    /**
     * Sentinel 连接配置
     * @minItems 1
     */
    readonly sentinels?: {
        /**
         * 服务器地址
         */
        readonly host: string,

        /**
         * 端口
         * @type number
         * @minimum 1
         * @maximum 65535
         * @default 26379
         */
        readonly port?: number
    }[];
}
//#endmodule redis

export interface IStorageConf {
    //#module mongodb
    readonly mongodb: IMongodbConfig;
    //#endmodule mongodb
    //#module redis
    readonly redis: IRedisConfig;
    //#endmodule redis
}
