import _ from 'lodash';
import httpStatus from 'http-status';

import { LogLevel } from '../logger';
import { errorMessages } from './error.messages';

interface ErrorOptions {
    meta?: any,
    httpCode?: number,
    wrapper?: Function
}

abstract class AppError extends Error {
    public readonly isAppError = true;
    public abstract readonly name: string;
    public code: number;
    public level: LogLevel;
    public meta: any;
    public httpCode: number;

    constructor (code: number, level: LogLevel, options: ErrorOptions) {
        super();
        Error.captureStackTrace(this, options.wrapper || this.constructor);
        this.code = code || 1;
        this.message = errorMessages[code] || 'Unknown Error';
        this.level = level || LogLevel.error;
        this.meta = options.meta;
        this.httpCode = options.httpCode || httpStatus.BAD_REQUEST;
    }
}

export class UserError extends AppError {
    public name = 'UserError';
}
