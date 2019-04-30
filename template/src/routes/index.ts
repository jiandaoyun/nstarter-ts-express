import { Router } from 'express';
import { viewRouter } from './view.route';
import { requestRouter } from './request.route';

// main router
export const router = Router();
router.use('/', viewRouter);
router.use('/', requestRouter);
