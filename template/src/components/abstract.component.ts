import { injectable } from 'inversify';

import { Logger } from 'nstarter-core';

@injectable()
export abstract class AbstractComponent {
    protected _name: string;

    public async shutdown () {

    }

    protected log() {
        Logger.info(`init ${ this._name } ... ok`);
    }
}
