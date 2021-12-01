import { ContextProvider, controller } from 'nstarter-core';
import { Request, Response } from 'express';
import { Errors } from '../errors';
import { pingService } from '../services';

@controller()
export class DemoController {
    public async goWelcomeView(req: Request, res: Response) {
        const { params } = req;
        return res.render('welcome', {
            //#module i18n
            //#alt
            //# title: 'To Infinity and Beyond!'
            //#endalt
            title: req.i18n.t('page.demo.title')
            //#endmodule i18n
        });
    };

    public async goErrorView(req: Request, res: Response) {
        const { params } = req;
        throw Errors.user(1001);
    };

    public async doPing(req: Request, res: Response) {
        const { body } = req;
        const context = ContextProvider.getContext();
        pingService.ping();
        return res.json({
            'msg': 'pong',
            'traceId': context?.traceId
        });
    }
}
