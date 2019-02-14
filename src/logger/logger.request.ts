import _ from 'lodash';
import winston, { format } from 'winston';
import Transport from 'winston-transport';
import RotateFileTransport, {
    DailyRotateFileTransportOptions
} from 'winston-daily-rotate-file';
import Graylog2Transport from 'winston-graylog2';

import { config } from '../config';
import { Consts } from '../constants';
import { RequestHandler, Request, Response } from 'express';

const transports: Transport[] = [];

// custom log formatter
const formatter = format.printf((info) => {
    return `${info.timestamp} - [ACCESS] ${info.message}`;
});

// console transport
const { console: consoleLogConf } = config.system.log;
if (consoleLogConf.enabled) {
    const formats = [
        format.timestamp(),
        formatter
    ];
    transports.push(new winston.transports.Console({
        level: 'info',
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
        filename: 'access_%DATE%.log',
        format: format.combine(
            format.timestamp(),
            formatter
        )
    }));
}

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
            type: 'request',
            env: config.env,
            version: config.version
        }
    }) as Transport);
}

class RequestLogger {
    private _logger = winston.createLogger({
        transports
    });

    public log(msg: string, meta?: object) {
        this._logger.log('info', msg, meta);
    }

    private _formatRequest(req: Request, res: Response, duration: string) {
        return `${ req.ip } ${ req.method } ${ req.originalUrl } HTTP/${
            req.httpVersion } ${ res.statusCode || '-' } ${
            res.getHeader('content-length')|| '-' } - ${ duration } ms`;
    }

    private _logRequest(req: Request, res: Response, startAt: [number, number]) {
        const time = process.hrtime(startAt);
        const duration = (time[0] * 1e3 + time[1] * 1e-6).toFixed(3);
        const meta = {
            path: req.originalUrl,
            ip: req.ip,
            body: req.body,
            query: req.query,
            duration,
            status: res.statusCode,
            method: req.method,
            user_agent: _.get(req.headers, 'user-agent'),
            req_id: _.get(req.headers, 'request-id'),
            http_version: req.httpVersion
        };
        this.log(this._formatRequest(req, res, duration), meta);
        // TODO log performatce
    }

    public get middleware(): RequestHandler {
        return (req, res, next) => {
            const startAt = process.hrtime();
            const reqLogger = _.once(() => this._logRequest(req, res, startAt));
            req.on('close', reqLogger);
            res.on('finish', reqLogger);
            return next();
        };
    }
}

export const reqLogger = new RequestLogger();
