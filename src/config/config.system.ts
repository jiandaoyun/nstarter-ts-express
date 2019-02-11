interface LogConf {
    readonly enabled: boolean;
    readonly level: string;
}

interface FileLogConf extends LogConf {
    readonly dir?: string;
    readonly zip?: boolean;
    readonly rotate_days?: number;
}

interface GraylogConf extends LogConf {
    readonly servers: {
        readonly host: string,
        readonly port: number
    }[];
}

interface SentryConf extends LogConf {
    readonly dsn: string;
}

export interface SystemConfig {
    readonly locale: string;
    readonly log: {
        readonly console: LogConf,
        readonly file: FileLogConf,
        readonly graylog: GraylogConf,
        readonly sentry: SentryConf
    };
}