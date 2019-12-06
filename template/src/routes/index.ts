import { Router } from 'express';
import * as DemoController from '../controllers/demo.controller';
import { ErrorHandler } from './middlewares/error.handler';

export const requestRouter = Router();

requestRouter.post('/ping', DemoController.doPing);
requestRouter.use(ErrorHandler.requestErrorHandler);

export const viewRouter = Router();

viewRouter.get('/', DemoController.goWelcomeView);
viewRouter.get('/error', DemoController.goErrorView);
viewRouter.use(ErrorHandler.viewErrorHandler);

// main router
export const router = Router();
router.use('/', viewRouter);
router.use('/', requestRouter);
