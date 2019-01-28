import { RequestHandler } from 'express';

export class DemoRoute {
    public static goWelcomeView: RequestHandler = (req, res, next) => {
        return res.render('welcome', {
            title: 'welcome'
        });
    }

    public static goErrorView: RequestHandler = (req, res, next) => {
        return next({ code: 1001, message: 'Oops!' });
    }

    public static doPing: RequestHandler = (req, res, next) => {
        return res.json({ 'msg': 'pong' });
    }
}
