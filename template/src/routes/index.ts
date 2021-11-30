import { Router } from 'express';
import { ErrorHandler } from './middlewares/error.handler';
import {
    demoController,
} from '../controllers';

export const requestRouter = Router();

requestRouter.post('/ping', demoController.doPing);
requestRouter.use(ErrorHandler.requestErrorHandler);

export const viewRouter = Router();

viewRouter.get('/', demoController.goWelcomeView);
viewRouter.get('/error', demoController.goErrorView);
viewRouter.use(ErrorHandler.viewErrorHandler);

// main router
export const router = Router();
router.use('/', viewRouter);
router.use('/', requestRouter);
