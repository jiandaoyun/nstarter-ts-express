import { injectable } from 'inversify';

import { Logger } from 'nstarter-core';

@injectable()
export abstract class AbstractComponent {
    protected _name: string;

    protected log() {
        Logger.info(`init ${ this._name } ... ok`);
    }
}
