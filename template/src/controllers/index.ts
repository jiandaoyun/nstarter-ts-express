import { getCtl, registerCtl } from 'nstarter-core';
import { DemoController } from './demo.controller';

registerCtl(DemoController);

export const demoController = getCtl<DemoController>(DemoController);
