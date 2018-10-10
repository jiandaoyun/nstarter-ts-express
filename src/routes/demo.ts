import { RequestHandler } from "express";

export class DemoRoute {
    static goWelcomeView: RequestHandler = (req, res, next) => {
        return res.render('welcome');
    }

    static doPing: RequestHandler = (req, res, next) => {
        return res.json({ 'msg': 'pong' });
    }
}
