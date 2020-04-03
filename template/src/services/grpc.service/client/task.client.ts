import { sendUnaryData } from 'grpc';
import { provideSvc } from 'nstarter-core';
import {
    grpcClient,
    grpcUnaryCall,
    grpcStreamingCall,
    StreamingCallback
} from 'nstarter-grpc';
import { TaskConf, TaskReply, TaskResult } from '../../../types/services/grpc';

@grpcClient()
@provideSvc()
export class TaskClientService {
    @grpcUnaryCall()
    public runTask(conf: TaskConf, callback: sendUnaryData<TaskResult>): void {}

    @grpcStreamingCall()
    public runTaskProgress(conf: TaskConf, callback: StreamingCallback<TaskReply>) {}
}
