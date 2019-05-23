import _ from 'lodash';
import Transport, { TransportStreamOptions } from 'winston-transport';
import * as Sentry from '@sentry/node';
import { LEVEL } from 'triple-beam';
import { config } from '../../../../config';

interface SentryTransportOptions extends TransportStreamOptions, Sentry.NodeOptions {}

const sentryLevelMap: Record<string, Sentry.Severity> = {
    debug: Sentry.Severity.Debug,
    info: Sentry.Severity.Info,
    warn: Sentry.Severity.Warning,
    error: Sentry.Severity.Error
};

export class SentryTransport extends Transport {
    private readonly _dsn?: string;

    constructor(options: SentryTransportOptions) {
        super(options);
        this._dsn = options.dsn;
        Sentry.init({
            dsn: this._dsn,
            release: config.version,
            environment: config.env,
            serverName: config.hostname,
            integrations: (integrations) => {
                // prevent from exit
                // @see https://github.com/getsentry/sentry-javascript/issues/1661#issuecomment-430666925
                return integrations.filter((integration) =>
                    integration.name !== 'OnUncaughtException'
                );
            }
        });
    }

    public log(info: any, callback: Function): void {
        setImmediate(() => {
            this.emit('logged', info);
        });
        const level = _.get(sentryLevelMap, info[LEVEL], Sentry.Severity.Error);
        // @see https://github.com/winstonjs/winston#streams-objectmode-and-info-objects
        if (info.error) {
            // error info
            Sentry.withScope((scope) => {
                scope.setLevel(level);
                Sentry.captureException(info.error);
            });
        } else {
            // string info
            Sentry.captureMessage(info.message, level);
        }
        return callback();
    }
}
