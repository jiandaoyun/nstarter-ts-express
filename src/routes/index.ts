import { Router } from 'express';
import { DemoRoute } from './demo';

export const router = Router();
const viewRouter = Router(),
    requestRouter = Router();

viewRouter.get('/', DemoRoute.goWelcomeView);

requestRouter.post('/ping', DemoRoute.doPing);
