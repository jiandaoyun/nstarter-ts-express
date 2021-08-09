import { getCtl, registerCtl } from 'nstarter-core';
import { DemoController } from './demo.controller';
import { RpcController } from './rpc.controller';

registerCtl(DemoController);
registerCtl(RpcController);

export const demoController = getCtl(DemoController);
export const rpcController = getCtl(RpcController);
