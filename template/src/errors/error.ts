import _ from 'lodash';
import httpStatus from 'http-status';

import { LogLevel } from '../enums/logger.enum';
import { ErrorTypes, errorMessages } from './err_msgs';

interface ErrorOptions {
    meta?: any,
    httpCode?: number,
    wrapper?: Function
}

class CustomError extends Error implements Error {
    public readonly isCustomError = true;
    public readonly name: string;
    public readonly message: string;
    public readonly code: number;
    public readonly level: LogLevel;
    public readonly meta: any;
    public readonly httpCode: number;

    constructor (name: string, code: number, level?: LogLevel, options?: ErrorOptions) {
        super();
        this.name = name || this.constructor.name;
        this.code = code || 1;
        this.message = errorMessages[code] || 'Unknown Error';
        this.level = level || LogLevel.error;
        let trace = this.constructor;
        if (options) {
            this.meta = options.meta;
            this.httpCode = options.httpCode || httpStatus.BAD_REQUEST;
            trace = options.wrapper || this.constructor;
        }
        Error.captureStackTrace(this, trace);
    }
}

interface ErrorBuilder {
    (code: number, level?: LogLevel, options?: ErrorOptions): Error
}

export const errors = {} as Record<keyof typeof ErrorTypes, ErrorBuilder>;
_.forEach(Object.keys(ErrorTypes), (errorType: keyof typeof ErrorTypes) => {
    errors[errorType] = (...args) => new CustomError(ErrorTypes[errorType], ...args) as Error;
});
