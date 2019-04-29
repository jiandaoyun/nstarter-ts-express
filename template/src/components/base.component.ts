import { injectable } from 'inversify';
import { logger } from './lib/logger';

@injectable()
export abstract class BaseComponent {
    protected _name: string;

    protected log () {
        logger.info(`${ this._name } service ... ok`);
    }
}
