import winston from 'winston';
import Transport from 'winston-transport';
import RotateFileTransport from 'winston-daily-rotate-file';
import Graylog2Transport from 'winston-graylog2';

const transports: Transport[] = [];

// file transport
transports.push(new RotateFileTransport({
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '14d'
}));

// graylog transport
transports.push(new Graylog2Transport({
    graylog: {
        servers: []
    }
}) as Transport);

export const logger = winston.createLogger({
    transports,
    exitOnError: false
});
