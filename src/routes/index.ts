import { Router } from 'express';
import { ErrorHandler } from '../middlewares/error.handler';
import { DemoRoute } from './demo';

const viewRouter = Router(),
    requestRouter = Router();

viewRouter.get('/', DemoRoute.goWelcomeView);
viewRouter.get('/error', DemoRoute.goErrorView);
viewRouter.use(ErrorHandler.viewErrorHandler);

requestRouter.post('/ping', DemoRoute.doPing);
requestRouter.use(ErrorHandler.requestErrorHandler);

// main router
export const router = Router();
router.use('/', viewRouter);
router.use('/', requestRouter);
