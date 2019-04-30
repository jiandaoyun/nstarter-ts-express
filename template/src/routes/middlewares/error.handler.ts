import { ErrorRequestHandler } from 'express';

export class ErrorHandler {
    public static viewErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
        return res.status(400).render('error', {
            title: err.message,
            error: err
        });
    }

    public static requestErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
        return res.status(400).json({
            error: err.message
        });
    }
}
