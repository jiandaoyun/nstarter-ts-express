import { Router } from 'express';
import { ErrorHandler } from './middlewares/error.handler';
import {
    demoController,
} from '../controllers';

export { securityMiddlewares } from './middlewares/security.handler';

export const requestRouter = Router();

requestRouter.post('/ping', demoController.doPing);
//#module mongodb
requestRouter.post('/user/create', demoController.doCreateUser);
requestRouter.post('/user/find', demoController.doFindUser);
//#endmodule mongodb
//#module rabbitmq
requestRouter.post('/run_task', demoController.doStartQueueTask);
//#endmodule rabbitmq
requestRouter.use(ErrorHandler.requestErrorHandler);

export const viewRouter = Router();

viewRouter.get('/', demoController.goWelcomeView);
viewRouter.get('/error', demoController.goErrorView);
viewRouter.use(ErrorHandler.viewErrorHandler);

// main router
export const router = Router();
router.use('/', viewRouter);
router.use('/', requestRouter);
