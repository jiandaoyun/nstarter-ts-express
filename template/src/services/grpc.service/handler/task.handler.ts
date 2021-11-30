import _ from 'lodash';
import async from 'async';
import { sendUnaryData, ServerWritableStream } from '@grpc/grpc-js';

import { service } from 'nstarter-core';
import { grpcService, grpcStreamingMethod, grpcUnaryMethod } from 'nstarter-grpc';

import { TaskConf, TaskReply, TaskResult } from '../../../types/services/grpc';

@grpcService('worker', 'TaskService')
@service()
export class TaskHandlerService {
    /**
     * gRPC 单参数调用服务端示例
     * @param conf
     * @param callback
     */
    @grpcUnaryMethod()
    public runTask(conf: TaskConf, callback: sendUnaryData<TaskResult>) {
        const { id, job } = conf;
        return callback(null, {
            status: 'ok',
            result: job
        });
    }

    /**
     * gRPC 流式调用服务端示例
     * @param conf
     * @param call
     */
    @grpcStreamingMethod()
    public runTaskProgress(conf: TaskConf, call: ServerWritableStream<TaskConf, TaskReply>) {
        const { id, job } = conf;
        async.eachSeries(_.times(11), (idx, callback) => {
            call.write({ message: `${ idx * 10 }% task: #${ id } ${ job }` });
            setTimeout(callback, 200);
        }, () => {
            call.end();
        });
    }
}
