interface LogConf {
    readonly enabled: boolean;
    readonly level: string;
}

interface ConsoleLogConf extends LogConf {
    readonly colorize?: boolean;
}

interface FileLogConf extends LogConf {
    readonly dir?: string;
    readonly zip?: boolean;
    readonly rotate_days?: number;
}

//#module graylog
interface GraylogConf extends LogConf {
    readonly servers: {
        readonly host: string,
        readonly port: number
    }[];
}
//#endmodule graylog

//#module sentry
interface SentryConf extends LogConf {
    readonly dsn: string;
}
//#endmodule sentry

export interface SystemConfig {
    readonly locale: string;
    readonly timezone: string;
    readonly log: {
        readonly console: ConsoleLogConf,
        readonly file: FileLogConf,
        //#module graylog
        readonly graylog: GraylogConf,
        //#endmodule graylog
        //#module sentry
        readonly sentry: SentryConf
        //#endmodule sentry
    };
    readonly req_log: {
        readonly enabled: boolean;
    }
}