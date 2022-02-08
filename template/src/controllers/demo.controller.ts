import { ContextProvider, controller } from 'nstarter-core';
import { Request, Response } from 'express';
import { Errors } from '../errors';
import {
    //#module rabbitmq
    queueService,
    //#endmodule rabbitmq
    //#module mongodb
    userService,
    //#endmodule mongodb
    pingService,
} from '../services';

@controller()
export class DemoController {
    /**
     * 主页渲染 & 国际化示例
     * @param req
     * @param res
     */
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

    /**
     * 错误页面示例
     * @param req
     * @param res
     */
    public async goErrorView(req: Request, res: Response) {
        const { params } = req;
        throw Errors.user(1001);
    };

    /**
     * POST 请求 & 上下文跟踪示例
     * @param req
     * @param res
     */
    public async doPing(req: Request, res: Response) {
        const { body } = req;
        const context = ContextProvider.getContext();
        pingService.ping();
        return res.json({
            'msg': 'pong',
            'traceId': context?.traceId
        });
    }

    //#module mongodb
    /**
     * 创建用户请求示例
     * @param req
     * @param res
     */
    public async doCreateUser(req: Request, res: Response) {
        const { username } = req.body;
        const user = await userService.userCreate({
            username,
            nickname: username,
            password: 'paS8w0rd',
            salt: 'demo'
        });
        return res.json({
            user: {
                username: user.username,
                nickname: user.nickname
            }
        });
    }

    /**
     * 查找用户请求示例
     * @param req
     * @param res
     */
    public async doFindUser(req: Request, res: Response) {
        const { username } = req.body;
        const user = await userService.findUserByUsername(username);
        return res.json({
            user: {
                username: user.username,
                nickname: user.nickname
            }
        });
    }
    //#endmodule mongodb

    //#module rabbitmq
    /**
     * 队列任务触发示例
     * @param req
     * @param res
     */
    public async doStartQueueTask(req: Request, res: Response) {
        const context = ContextProvider.getContext();
        await queueService.sendNormalMessage();
        return res.json({
            'msg': 'task created',
            'traceId': context?.traceId
        });
    }
    //#endmodule rabbitmq
}
