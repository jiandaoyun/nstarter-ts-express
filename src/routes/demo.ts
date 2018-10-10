import { RequestHandler } from "express";

export class DemoRoute {
    static goWelcomeView: RequestHandler = (req, res, next) => {
        return res.render('welcome', {
            title: 'welcome'
        });
    }

    static goErrorView: RequestHandler = (req, res, next) => {
        return next({ code: 1001, message: 'Oops!' });
    }

    static doPing: RequestHandler = (req, res, next) => {
        return res.json({ 'msg': 'pong' });
    }
}
