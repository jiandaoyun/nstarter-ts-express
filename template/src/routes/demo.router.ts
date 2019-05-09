import { RequestHandler } from 'express';
import { Errors } from '../errors';

export const goWelcomeView: RequestHandler = (req, res, next) => {
    return res.render('welcome', {
        //#module i18n
        //#alt
        //# title: 'To Infinity and Beyond!'
        //#endalt
        title: req.i18n.t('page.demo.title')
        //#endmodule i18n
    });
};

export const goErrorView: RequestHandler = (req, res, next) => {
    return next(Errors.user(1001));
};

export const doPing: RequestHandler = (req, res, next) => {
    return res.json({ 'msg': 'pong' });
};
