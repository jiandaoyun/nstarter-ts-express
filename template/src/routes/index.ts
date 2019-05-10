import { Router } from 'express';
import * as DemoRouter from './demo.router';
import { ErrorHandler } from './middlewares/error.handler';

export const requestRouter = Router();

requestRouter.post('/ping', DemoRouter.doPing);
requestRouter.use(ErrorHandler.requestErrorHandler);

export const viewRouter = Router();

viewRouter.get('/', DemoRouter.goWelcomeView);
viewRouter.get('/error', DemoRouter.goErrorView);
viewRouter.use(ErrorHandler.viewErrorHandler);

// main router
export const router = Router();
router.use('/', viewRouter);
router.use('/', requestRouter);
