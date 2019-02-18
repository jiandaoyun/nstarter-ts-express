import _ from 'lodash';
import os from 'os';
import winston, { format } from 'winston';
import Transport from 'winston-transport';
import RotateFileTransport, {
    DailyRotateFileTransportOptions
} from 'winston-daily-rotate-file';
import Graylog2Transport from 'winston-graylog2';
import { SentryTransport } from './transports';

import { config } from '../config';
import { Consts } from '../constants';

export enum LogLevel {
    debug = 'debug',
    info = 'info',
    warn = 'warn',
    error = 'error'
}

const levelConf = {
    levels: {
        error: 20,
        warn: 50,
        info: 80,
        debug: 90
    },
    colors: {
        debug: 'blue',
        info: 'green',
        warn: 'yellow',
        error: 'red'
    }
};

const errLevels = new Set<string>([LogLevel.error, LogLevel.warn]);

const transports: Transport[] = [];

// custom log formatter
const formatter = format.printf((info) => {
    let output = `${info.timestamp} - [${info.level}] ${info.message}`;
    if (info.error) {
        output = `${output}${os.EOL}\t${info.error.stack}`;
    }
    return output;
});

const levelFormatter = winston.format((info) => {
    info.level = info.level.toUpperCase();
    return info;
});

// log filter
const msgFilter = format((info) =>
    !errLevels.has(info.level) ? info : false
);
const errFilter = format((info) =>
    errLevels.has(info.level) ? info : false
);

// console transport
const { console: consoleLogConf } = config.system.log;
if (consoleLogConf.enabled) {
    const formats = [
        format.timestamp(),
        formatter
    ];
    if (config.system.log.console.colorize) {
        formats.unshift(winston.format.colorize());
    }
    formats.unshift(levelFormatter());
    transports.push(new winston.transports.Console({
        level: consoleLogConf.level,
        stderrLevels: [LogLevel.error],
        consoleWarnLevels: [LogLevel.warn, LogLevel.debug],
        format: format.combine(...formats)
    }));
}

// file transport
const { file: fileLogConf } = config.system.log;
if (fileLogConf.enabled) {
    const baseFileLogOptions: DailyRotateFileTransportOptions = {
        dirname: fileLogConf.dir || './log/',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: fileLogConf.zip || true,
        maxFiles: `${
            _.toInteger(fileLogConf.rotate_days) || Consts.System.DEFAULT_LOG_ROTATE_DAYS
            }d`
    };

    transports.push(new RotateFileTransport({
        ...baseFileLogOptions,
        level: fileLogConf.level,
        filename: 'app_%DATE%.log',
        format: format.combine(
            msgFilter(),
            format.timestamp(),
            formatter
        )
    }));
    transports.push(new RotateFileTransport({
        ...baseFileLogOptions,
        level: fileLogConf.level,
        filename: 'error_%DATE%.log',
        format: format.combine(
            errFilter(),
            format.timestamp(),
            formatter
        )
    }));
}

//#module graylog
// graylog transport
const { graylog: graylogConf } = config.system.log;
if (graylogConf.enabled && !_.isEmpty(graylogConf.servers)) {
    transports.push(new Graylog2Transport({
        level: graylogConf.level,
        graylog: {
            servers: graylogConf.servers,
            hostname: config.hostname
        },
        staticMeta: {
            type: 'log',
            env: config.env,
            version: config.version
        }
    }) as Transport);
}
//#endmodule graylog

//#module sentry
// sentry transport
const { sentry: sentryConf } = config.system.log;
if (sentryConf.enabled && sentryConf.dsn) {
    transports.push(new SentryTransport({
        level: sentryConf.level,
        dsn: sentryConf.dsn,
    }));
}
//#endmodule sentry

type LogMessage = string | Error;

winston.addColors(levelConf.colors);

class Logger {
    private _logger = winston.createLogger({
        transports,
        levels: levelConf.levels,
        exitOnError: false
    });

    private _log(level: string, msg: LogMessage, meta?: object) {
        if (typeof msg === 'string') {
            // log string
            this._logger.log(level, msg, meta);
        } else {
            // log error
            this._logger.log(level, msg.message, { ...meta, error: msg });
        }
    }

    public debug(msg: LogMessage, meta?: object) {
        this._log('debug', msg, meta);
    }

    public info(msg: LogMessage, meta?: object) {
        this._log('info', msg, meta);
    }

    public warn(msg: LogMessage, meta?: object) {
        this._log('warn', msg, meta);
    }

    public error(msg: LogMessage, meta?: object) {
        this._log('error', msg, meta);
    }
}

export const logger = new Logger();
