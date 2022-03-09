import _ from 'lodash';
import winston, { format } from 'winston';
import Transport from 'winston-transport';
import RotateFileTransport from 'winston-daily-rotate-file';
//#module graylog
import Graylog2Transport from 'winston-graylog2';
//#endmodule graylog
//#module loki
import LokiTransport from 'winston-loki';
//#endmodule loki

import { config } from '../../../config';
import { Consts } from '../../../constants';

export const requestTransports: Transport[] = [];

// 自定义日志格式化方法
const formatter = format.printf((info) =>
    `${ info.timestamp } - [ACCESS] ${ info.message }`);

// 控制台日志记录
const { console: consoleLogConf } = config.system.log;
if (consoleLogConf?.enabled) {
    const formats = [
        format.timestamp(),
        formatter
    ];
    requestTransports.push(new winston.transports.Console({
        level: 'info',
        format: format.combine(...formats)
    }));
}

// 文件日志记录
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
// Graylog 日志记录
const { graylog: graylogConf } = config.system.log;
if (graylogConf?.enabled && !_.isEmpty(graylogConf.servers)) {
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

//#module loki
// Grafana Loki 日志记录
const { loki: lokiConf } = config.system.log;
if (lokiConf?.enabled) {
    requestTransports.push(new LokiTransport({
        level: lokiConf.level,
        host: lokiConf.host,
        batching: lokiConf.batching,
        interval: lokiConf.interval,
        clearOnError: true,
        // Loki 日志格式化处理
        format: format.combine(
            format((info) => {
                info.labels = _.pick(info.metadata, [
                    'status', 'method'
                ]);
                // note: 对于离散动态属性，通过不同属性存储以避免跟踪性能问题
                info.hostname = config.hostname;
                const meta = _.pick(info.metadata, [
                    // note: 可在此扩展其他跟踪属性
                    'path', 'ip', 'request_id', 'duration'
                ]);
                _.extend(info, meta);
                delete info.metadata;
                return info;
            })(),
            format.json()
        ),
        labels: {
            service: 'ns-app',
            logger: 'request',
            env: config.env,
            version: config.version
        }
    }) as Transport);
}
//#endmodule loki
