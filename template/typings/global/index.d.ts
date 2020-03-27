import { LogLevel } from 'nstarter-core/src/constants';

declare global {
    interface Error {
        readonly code?: number | string;
        readonly level?: LogLevel;
        readonly meta?: any;
        readonly httpCode?: number;
        readonly isCustomError?: boolean;
    }

    interface Constructor<T = any> {
        new(...args: any[]): T;
    }

    interface Callback<T = any, E = Error> {
        (err?: E | null, result?: T): void;
    }
}
