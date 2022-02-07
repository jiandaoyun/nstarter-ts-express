import _ from 'lodash';
import os from 'os';
import winston, { format } from 'winston';
import Transport from 'winston-transport';
import RotateFileTransport from 'winston-daily-rotate-file';
import { LogLevel } from 'nstarter-core';
//#module graylog
import Graylog2Transport from 'winston-graylog2';
//#endmodule graylog
//#module sentry
import { SentryTransport } from './transports';
//#endmodule sentry

import { config } from '../../../config';
import { Consts } from '../../../constants';

const errLevels = new Set<string>([LogLevel.error, LogLevel.warn]);

export const defaultTransports: Transport[] = [];

// custom log formatter
const formatter = format.printf((info) => {
    let output = `${ info.timestamp } - [${ info.level }] ${ info.message }`;
    if (info.error) {
        output = `${ output }${ os.EOL }\t${ info.error.stack }`;
    }
    return output;
});

const levelFormatter = winston.format((info) => {
    info.level = info.level.toUpperCase();
    return info;
});

// log filter
const msgFilter = format((info) =>
    (!errLevels.has(info.level) ? info : false));
const errFilter = format((info) =>
    (errLevels.has(info.level) ? info : false));

// console transport
const { console: consoleLogConf } = config.system.log;
if (consoleLogConf?.enabled) {
    const formats = [
        format.timestamp(),
        formatter
    ];
    if (consoleLogConf.colorize) {
        formats.unshift(winston.format.colorize());
    }
    formats.unshift(levelFormatter());
    defaultTransports.push(new winston.transports.Console({
        level: consoleLogConf.level,
        stderrLevels: [LogLevel.error],
        consoleWarnLevels: [LogLevel.warn, LogLevel.debug],
        format: format.combine(...formats)
    }));
}

// file transport
const { file: fileLogConf } = config.system.log;
if (fileLogConf?.enabled) {
    const baseFileLogOptions = {
        dirname: fileLogConf.dir || './log/',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: fileLogConf.zip || true,
        maxFiles: `${
            _.toInteger(fileLogConf.rotate_days) || Consts.System.DEFAULT_LOG_ROTATE_DAYS
        }d`
    };

    defaultTransports.push(new RotateFileTransport({
        ...baseFileLogOptions,
        level: fileLogConf.level,
        filename: 'app_%DATE%.log',
        stream: undefined,
        format: format.combine(
            msgFilter(),
            format.timestamp(),
            formatter
        )
    }));
    defaultTransports.push(new RotateFileTransport({
        ...baseFileLogOptions,
        level: fileLogConf.level,
        filename: 'error_%DATE%.log',
        stream: undefined,
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
if (graylogConf?.enabled && !_.isEmpty(graylogConf.servers)) {
    defaultTransports.push(new Graylog2Transport({
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
if (sentryConf?.enabled && sentryConf.dsn) {
    defaultTransports.push(new SentryTransport({
        level: sentryConf.level,
        dsn: sentryConf.dsn,
    }));
}
//#endmodule sentry
