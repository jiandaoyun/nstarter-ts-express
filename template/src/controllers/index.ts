import { getCtl, registerCtl } from 'nstarter-core';
import { DemoController } from './demo.controller';
//#module grpc_client
import { RpcController } from './rpc.controller';
//#endmodule grpc_client

registerCtl(DemoController);
//#module grpc_client
registerCtl(RpcController);
//#endmodule grpc_client

export const demoController = getCtl(DemoController);
//#module grpc_client
export const rpcController = getCtl(RpcController);
//#endmodule grpc_client
