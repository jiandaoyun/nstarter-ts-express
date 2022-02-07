interface ILogConf {
    /**
     * 是否启用日志记录
     */
    readonly enabled: boolean;

    /**
     * 日志级别
     */
    readonly level: string;
}

interface IConsoleLogConf extends ILogConf {
    /**
     * 开启彩色输出
     */
    readonly colorize?: boolean;
}

interface IFileLogConf extends ILogConf {
    /**
     * 日志输出目录
     */
    readonly dir?: string;

    /**
     *
     */
    readonly zip?: boolean;
    readonly rotate_days?: number;
}

//#module graylog
interface IGraylogConf extends ILogConf {
    /**
     * 服务器列表
     */
    readonly servers: {
        /**
         * 服务器地址
         */
        readonly host: string,

        /**
         * 端口
         * @type integer
         */
        readonly port: number
    }[];
}
//#endmodule graylog

//#module loki
interface ILokiConf extends ILogConf {
    readonly host: string;

    /**
     * 日志发送时间间隔 (秒)
     * @type integer
     * @default 5
     */
    readonly interval?: number;

    /**
     * 是否批量发送日志
     * @default true
     */
    readonly batching?: boolean;
}
//#endmodule loki

//#module sentry
interface ISentryConf extends ILogConf {
    readonly dsn: string;
}
//#endmodule sentry

export interface ISystemConf {
    //#module i18n
    readonly locale: string;
    //#endmodule i18n
    readonly timezone: string;
    readonly log: {
        readonly console?: IConsoleLogConf,
        readonly file?: IFileLogConf,
        //#module graylog
        readonly graylog?: IGraylogConf,
        //#endmodule graylog
        //#module loki
        readonly loki?: ILokiConf,
        //#endmodule loki
        //#module sentry
        readonly sentry?: ISentryConf
        //#endmodule sentry
    };
    readonly req_log: {
        readonly enabled: boolean
    };
    //#module monitor
    readonly monitor: {
        readonly port?: number
    };
    //#endmodule monitor
    readonly trusted_proxy: string[];
}
