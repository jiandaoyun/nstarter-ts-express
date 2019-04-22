import { sendUnaryData } from 'grpc';
import {
    grpcClient,
    grpcUnaryCall,
    grpcServerStreamingCall
} from './decorators';
import { ServerStreamingCallback } from '../interfaces';
import { TaskConf, TaskResult, TaskReply } from '../task.types';

@grpcClient('worker')
export class TaskClient {
    @grpcUnaryCall()
    public static runTask(conf: TaskConf, callback: sendUnaryData<TaskResult>): void {}

    @grpcServerStreamingCall()
    public static runTaskProgress(conf: TaskConf, callback: ServerStreamingCallback<TaskReply>) {}
}
