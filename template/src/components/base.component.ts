import { logger } from '../logger';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseComponent {
    protected abstract _name: string;

    protected log () {
        logger.info(`${ this._name } service ... ok`);
    }
}
