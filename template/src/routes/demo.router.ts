import { RequestHandler } from 'express';
import { Errors } from '../errors';

export class DemoRouter {
    public static goWelcomeView: RequestHandler = (req, res, next) => {
        return res.render('welcome', {
            //#module i18n
            //#alt
            //# title: 'To Infinity and Beyond!'
            //#endalt
            title: req.i18n.t('page.demo.title')
            //#endmodule i18n
        });
    }

    public static goErrorView: RequestHandler = (req, res, next) => {
        return next(Errors.user(1001));
    }

    public static doPing: RequestHandler = (req, res, next) => {
        return res.json({ 'msg': 'pong' });
    }
}
