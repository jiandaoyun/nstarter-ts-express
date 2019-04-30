import { Logger } from './default.logger';
import { RequestLogger } from './request.logger';

export const logger = new Logger();
export const reqLogger = new RequestLogger();
