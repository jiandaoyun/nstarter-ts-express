import { injectable } from 'inversify';

import { BaseComponent } from './base.component';
import { Components } from './components';
import { logger, reqLogger } from './lib/logger';

@injectable()
export class LoggerComponent extends BaseComponent {
    protected _name = Components.logger;

    private _logger = logger;
    private _reqLogger = reqLogger;

    public get logger() {
        return this._logger;
    }

    public get reqLogger() {
        return this._reqLogger;
    }
}
