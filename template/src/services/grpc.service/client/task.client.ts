import { sendUnaryData } from 'grpc';
import { service } from 'nstarter-core';
import {
    grpcClient,
    grpcUnaryCall,
    grpcStreamingCall,
    StreamingCallback
} from 'nstarter-grpc';
import { TaskConf, TaskReply, TaskResult } from '../../../types/services/grpc';

@grpcClient()
@service()
export class TaskClientService {
    @grpcUnaryCall()
    public runTask(conf: TaskConf, callback: sendUnaryData<TaskResult>): void {}

    @grpcStreamingCall()
    public runTaskProgress(conf: TaskConf, callback: StreamingCallback<TaskReply>) {}
}
