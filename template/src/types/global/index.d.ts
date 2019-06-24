import { LogLevel } from '../../enums/logger.enum';

declare global {
    interface Error {
        readonly code?: number | string;
        readonly level?: LogLevel;
        readonly meta?: any;
        readonly httpCode?: number;
        readonly isCustomError?: boolean;
    }

    interface Constructor {
        new(...args: any[]): any
    }

    interface Callback<T = any, E = Error> {
        (err?: E | null, result?: T): void
    }
}
