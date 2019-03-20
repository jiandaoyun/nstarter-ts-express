import { RequestHandler } from '../middlewares/extensions';

export class DemoRoute {
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
        return next({ code: 1001, message: 'Oops!' });
    }

    public static doPing: RequestHandler = (req, res, next) => {
        return res.json({ 'msg': 'pong' });
    }
}
