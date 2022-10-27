import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';

export class ErrorHandler {
    public static viewErrorHandler: ErrorRequestHandler = ((err, req, res, next) => {
        if (err && !err.isNsError) {
            return res.status(httpStatus.BAD_REQUEST).end();
        }
        return res.status(httpStatus.BAD_REQUEST).render('error', {
            title: err.message,
            error: err
        });
    });

    public static requestErrorHandler: ErrorRequestHandler = ((err, req, res, next) => {
        if (err && !err.isNsError) {
            return res.status(httpStatus.BAD_REQUEST).end();
        }
        return res.status(httpStatus.BAD_REQUEST).json({
            error: err.message
        });
    });

    public static defaultErrorHandler: ErrorRequestHandler = ((err, req, res, next) => {
        if (err && !err.isNsError) {
            if (/^Unexpected\stoken/.test(err.message)) {
                // Invalid JSON
                return res.status(httpStatus.NOT_ACCEPTABLE).send({
                    error: 'Invalid JSON request.'
                });
            } else if (err.name === 'PayloadTooLargeError') {
                // Entity too large
                return res.status(httpStatus.REQUEST_ENTITY_TOO_LARGE).send({
                    error: 'Request entity too large.'
                });
            }
            return res.status(httpStatus.BAD_REQUEST).json({
                error: 'Bad request.'
            });
        }
        return res.status(httpStatus.BAD_REQUEST).json({
            error: err.message
        });
    });
}
