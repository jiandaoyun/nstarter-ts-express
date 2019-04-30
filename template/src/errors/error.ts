import _ from 'lodash';
import httpStatus from 'http-status';

import { LogLevel } from '../enums/logger.enum';
import { errorMessages } from './err_msgs';

interface ErrorOptions {
    meta?: any,
    httpCode?: number,
    wrapper?: Function
}

class BaseError extends Error {
    public readonly isAppError = true;
    public readonly name = this.constructor.name;
    public code: number;
    public level: LogLevel;
    public meta: any;
    public httpCode: number;

    constructor (code: number, level?: LogLevel, options?: ErrorOptions) {
        super();
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

export class UserError extends BaseError {}
