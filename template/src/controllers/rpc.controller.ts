/**
 * Copyright (c) 2015-2021, FineX, All Rights Reserved.
 * @author Zed
 * @date 2021/8/6
 */

import { Request, Response } from 'express';
import { controller } from 'nstarter-core';
import { rpcClientService, rpcHandlerService } from '../services';


@controller()
export class RpcController {

    public async doTask(req: Request, res: Response) {
        rpcClientService.runTask({ id: '123', job: 'say hello!' }, (error, result) => {
            console.log(result);
            res.json(result);
        });
    }

    public async doTaskProcess(req: Request, res: Response) {
        const stream = rpcClientService.runTaskProgress({ id: '123', job: 'say hello stream!' });
        if (stream) {
            stream.on('data', (data)=> {
                console.log(data);
            });
            res.json('stream ok!');
        }
    }
}

