import { Router } from 'express';
import { ErrorHandler } from './middlewares/error.handler';
import { DemoController } from '../controllers/demo.controller';

export const viewRouter = Router();

viewRouter.get('/', DemoController.goWelcomeView);
viewRouter.get('/error', DemoController.goErrorView);
viewRouter.use(ErrorHandler.viewErrorHandler);
