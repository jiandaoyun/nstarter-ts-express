import _ from 'lodash';
import { Logger, RequestLogger } from 'nstarter-core';
import { defaultTransports, requestTransports } from './lib/logger';
import { initGrpcProtoPackages } from './lib/grpc';

export const beforeLoad = () => {
    // 初始化日志记录
    _.forEach(defaultTransports, (transport) => {
        Logger.registerTransport(transport);
    });
    _.forEach(requestTransports, (transport) => {
        RequestLogger.registerTransport(transport);
    });

    //#module grpc_server|grpc_client
    // 加载 grpc proto buf 定义
    initGrpcProtoPackages();
    //#endmodule grpc_server|grpc_client
};
