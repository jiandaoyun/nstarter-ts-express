import _ from 'lodash';
import winston, { format } from 'winston';
import Transport from 'winston-transport';
import RotateFileTransport from 'winston-daily-rotate-file';
//#module graylog
import Graylog2Transport from 'winston-graylog2';
//#endmodule graylog

import { config } from '../../../config';
import { Consts } from '../../../constants';

export const requestTransports: Transport[] = [];

// custom log formatter
const formatter = format.printf((info) =>
    `${ info.timestamp } - [ACCESS] ${ info.message }`);

// console transport
const { console: consoleLogConf } = config.system.log;
if (consoleLogConf.enabled) {
    const formats = [
        format.timestamp(),
        formatter
    ];
    requestTransports.push(new winston.transports.Console({
        level: 'info',
        format: format.combine(...formats)
    }));
}

// file transport
const { file: fileLogConf } = config.system.log;
if (fileLogConf.enabled) {
    const baseFileLogOptions = {
        dirname: fileLogConf.dir || './log/',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: fileLogConf.zip || true,
        maxFiles: `${
            _.toInteger(fileLogConf.rotate_days) || Consts.System.DEFAULT_LOG_ROTATE_DAYS
        }d`
    };

    requestTransports.push(new RotateFileTransport({
        ...baseFileLogOptions,
        level: fileLogConf.level,
        filename: 'access_%DATE%.log',
        stream: undefined,
        format: format.combine(
            format.timestamp(),
            formatter
        )
    }));
}

//#module graylog
// graylog transport
const { graylog: graylogConf } = config.system.log;
if (graylogConf.enabled && !_.isEmpty(graylogConf.servers)) {
    requestTransports.push(new Graylog2Transport({
        level: graylogConf.level,
        graylog: {
            servers: graylogConf.servers,
            hostname: config.hostname
        },
        staticMeta: {
            type: 'request',
            env: config.env,
            version: config.version
        }
    }) as Transport);
}
//#endmodule graylog
