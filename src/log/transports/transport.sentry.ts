import Transport, { TransportStreamOptions } from 'winston-transport';
import Sentry from '@sentry/node';
import { LEVEL, MESSAGE } from 'triple-beam';

export interface SentryTransportOptions extends TransportStreamOptions {
    dsn: string
}

export class SentryTransport extends Transport {
    private _dsn: string;

    constructor(options: SentryTransportOptions) {
        super(options);
        this._dsn = options.dsn;
        Sentry.init({ dsn: this._dsn });
    }

    public log(info: any, callback: Function): void {
        setImmediate(() => {
            this.emit('logged', info);
        });
        const level = info[LEVEL],
            message = info[MESSAGE];
        if (typeof message === 'string') {
            // string info
            Sentry.captureMessage(info);
        } else {
            // error info
            Sentry.withScope((scope) => {
                scope.setLevel(level);
                Sentry.captureException(message);
            });
        }
        return callback();
    }
}
