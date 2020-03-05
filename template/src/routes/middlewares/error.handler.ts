import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';

export class ErrorHandler {
    public static viewErrorHandler: ErrorRequestHandler = ((err, req, res, next) => {
        if (err && !err.isCustomError) {
            return res.status(httpStatus.BAD_REQUEST).end();
        }
        return res.status(httpStatus.BAD_REQUEST).render('error', {
            title: err.message,
            error: err
        });
    });

    public static requestErrorHandler: ErrorRequestHandler = ((err, req, res, next) => {
        if (err && !err.isCustomError) {
            return res.status(httpStatus.BAD_REQUEST).end();
        }
        return res.status(httpStatus.BAD_REQUEST).json({
            error: err.message
        });
    });
}
