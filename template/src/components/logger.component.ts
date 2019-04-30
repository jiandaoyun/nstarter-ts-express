import { BaseComponent } from './base.component';
import { logger, reqLogger } from './lib/logger';
import { provideComponent } from './container';

@provideComponent()
export class LoggerComponent extends BaseComponent {
    private _logger = logger;
    private _reqLogger = reqLogger;

    public get logger() {
        return this._logger;
    }

    public get reqLogger() {
        return this._reqLogger;
    }
}
