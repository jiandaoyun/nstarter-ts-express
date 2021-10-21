import { Router } from 'express';
import { ErrorHandler } from './middlewares/error.handler';
import {
    demoController,
    //#module grpc_client
    rpcController,
    //#endmodule grpc_client
} from '../controllers';

export const requestRouter = Router();

requestRouter.post('/ping', demoController.doPing);
//#module grpc_client
requestRouter.get('/rpc/task', rpcController.doTask);
requestRouter.get('/rpc/taskProcess', rpcController.doTaskProcess);
//#endmodule grpc_client
requestRouter.use(ErrorHandler.requestErrorHandler);

export const viewRouter = Router();

viewRouter.get('/', demoController.goWelcomeView);
viewRouter.get('/error', demoController.goErrorView);
viewRouter.use(ErrorHandler.viewErrorHandler);

// main router
export const router = Router();
router.use('/', viewRouter);
router.use('/', requestRouter);
