import { Router } from 'express';
import { ErrorHandler } from './middlewares/error.handler';
import { DemoController } from '../controllers/demo.controller';

export const requestRouter = Router();

requestRouter.post('/ping', DemoController.doPing);
requestRouter.use(ErrorHandler.requestErrorHandler);
