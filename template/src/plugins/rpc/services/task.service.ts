import _ from 'lodash';
import async from 'async';
import { sendUnaryData, ServerWriteableStream } from 'grpc';

import {
    grpcService,
    grpcUnaryMethod,
    grcpServerStreamingMethod
} from './decorators';
import { TaskConf, TaskResult, TaskReply } from '../types/task.types';

@grpcService('worker')
export class TaskService {
    /**
     * Demo for gRPC unary call handler
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
     * Demo for gRPC server streaming call handler
     * @param conf
     * @param call
     */
    @grcpServerStreamingMethod()
    public runTaskProgress(conf: TaskConf, call: ServerWriteableStream<TaskReply>) {
        const { id, job } = conf;
        async.eachSeries(_.times(11), (idx, callback) => {
            call.write({ message: `${ idx * 10 }% task: #${ id } ${ job }` });
            setTimeout(callback, 200);
        }, () => {
            call.end();
        });
    }
}
