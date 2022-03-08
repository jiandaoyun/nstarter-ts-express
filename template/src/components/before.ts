import _ from 'lodash';
import { Logger, RequestLogger, ContextProvider } from 'nstarter-core';
import { defaultTransports, reqMetaFormatter, requestTransports } from './lib/logger';
import { Context } from '../context';
//#module grpc_server|grpc_client
import { initGrpcProtoPackages } from './lib/grpc';
//#endmodule grpc_server|grpc_client

export const beforeLoad = () => {
    // 初始化上下文
    ContextProvider.initialize(Context);

    // 初始化日志记录
    _.forEach(defaultTransports, (transport) => {
        Logger.registerTransport(transport);
    });
    _.forEach(requestTransports, (transport) => {
        RequestLogger.registerTransport(transport);
    });

    RequestLogger.setMetaFormatter(reqMetaFormatter);

    //#module grpc_server|grpc_client
    // 加载 grpc proto buf 定义
    initGrpcProtoPackages();
    //#endmodule grpc_server|grpc_client
};
