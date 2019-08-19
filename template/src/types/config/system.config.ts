import { IBaseConf } from './base.config';

interface ILogConf {
    readonly enabled: boolean;
    readonly level: string;
}

interface IConsoleLogConf extends ILogConf {
    readonly colorize?: boolean;
}

interface IFileLogConf extends ILogConf {
    readonly dir?: string;
    readonly zip?: boolean;
    readonly rotate_days?: number;
}

//#module graylog
interface IGraylogConf extends ILogConf {
    readonly servers: {
        readonly host: string,
        readonly port: number
    }[];
}
//#endmodule graylog

//#module sentry
interface ISentryConf extends ILogConf {
    readonly dsn: string;
}
//#endmodule sentry

export interface ISystemConf extends IBaseConf {
    //#module i18n
    readonly locale: string;
    //#endmodule i18n
    readonly timezone: string;
    readonly log: {
        readonly console: IConsoleLogConf,
        readonly file: IFileLogConf,
        //#module graylog
        readonly graylog: IGraylogConf,
        //#endmodule graylog
        //#module sentry
        readonly sentry: ISentryConf
        //#endmodule sentry
    };
    readonly req_log: {
        readonly enabled: boolean
    };
    //#module monitor
    readonly monitor: {
        readonly port?: number,
        readonly metric_path: string,
        readonly health_path: string,
        //#module cron
        readonly gateway: string
        //#endmodule cron
    };
    //#endmodule monitor
}
