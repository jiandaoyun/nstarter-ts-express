import { RequestHandlerExt } from '../middlewares/extensions';

export class DemoRoute {
    public static goWelcomeView: RequestHandlerExt = (req, res, next) => {
        return res.render('welcome', {
            title: req.i18n.t('page.demo.title')
        });
    }

    public static goErrorView: RequestHandlerExt = (req, res, next) => {
        return next({ code: 1001, message: 'Oops!' });
    }

    public static doPing: RequestHandlerExt = (req, res, next) => {
        return res.json({ 'msg': 'pong' });
    }
}
