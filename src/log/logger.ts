import os from 'os';
import winston, { format } from 'winston';
import Transport from 'winston-transport';
import RotateFileTransport, {
    DailyRotateFileTransportOptions
} from 'winston-daily-rotate-file';
import Graylog2Transport from 'winston-graylog2';

import { config } from '../config';

const errLevels = new Set(['error', 'warn']);

const transports: Transport[] = [];

// custom log formatter
const formatter = format.printf((info) => {
    let output = `${ info.timestamp } - [${ info.level.toUpperCase() }] ${ info.message }`;
    if (info.error) {
        output = `${ output }${ os.EOL }\t${ info.error.stack }`;
    }
    return output;
});

// log filter
const msgFilter = format((info) =>
    !errLevels.has(info.level) ? info : false
);
const errFilter = format((info) =>
    errLevels.has(info.level) ? info : false
);

// console transport
transports.push(new winston.transports.Console({
    level: 'info',
    stderrLevels: ['error'],
    consoleWarnLevels: ['warn', 'debug'],
    format: format.combine(
        winston.format.colorize(),
        format.timestamp(),
        formatter
    )
}));

// file transport
const baseFileLogOptions: DailyRotateFileTransportOptions = {
    dirname: './log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '14d'
};

transports.push(new RotateFileTransport({
    ...baseFileLogOptions,
    level: 'info',
    filename: 'app_%DATE%.log',
    format: format.combine(
        msgFilter(),
        format.timestamp(),
        formatter
    )
}));
transports.push(new RotateFileTransport({
    ...baseFileLogOptions,
    level: 'warn',
    filename: 'error_%DATE%.log',
    format: format.combine(
        errFilter(),
        format.timestamp(),
        formatter
    )
}));

// graylog transport
transports.push(new Graylog2Transport({
    level: 'info',
    graylog: {
        servers: [],
        hostname: config.hostname
    }
}) as Transport);

export const logger = winston.createLogger({
    transports,
    exitOnError: false
});
