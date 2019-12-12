import { injectable } from 'inversify';

import { logger } from './lib/logger';

@injectable()
export abstract class AbstractComponent {
    protected _name: string;

    protected log() {
        logger.info(`init ${ this._name } ... ok`);
    }
}
