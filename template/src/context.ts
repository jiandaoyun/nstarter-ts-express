import { Request } from 'express';
import { BaseContext } from 'nstarter-core';

export class Context extends BaseContext {

    /**
     * 根据请求初始化上下文
     * @param req - 请求对象
     */
    public setByRequest(req: Request) {
        super.setByRequest(req);
    }
}
