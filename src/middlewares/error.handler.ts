import { ErrorRequestHandler } from "express";

export class ErrorHandler {
    static viewErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
        return res.status(400).render('error', {
            title: err.message,
            error: err
        });
    };

    static requestErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
        return res.status(400).json({
            error: err.message
        });
    };
}
