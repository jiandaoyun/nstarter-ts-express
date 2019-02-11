import _ from 'lodash';
import { config } from '../config';
import { ServiceOptions } from '../config/config.service';

export abstract class BaseService {
    public abstract name: string;
    public wanted: string[] = [];

    public active = false;
    protected _config: ServiceOptions;
    protected _enabled: boolean;

    public get enabled(): boolean {
        // all dependent services must be enabled
        if (_.isNil(this._enabled)) {
            let enabled = this._getConfig().enabled;
            _.forEach(this.wanted, (wanted) => {
                if (!enabled) {
                    return false;
                }
                enabled = enabled && this._getServiceConfig(wanted).enabled;
                return;
            });
            this._enabled = enabled;
        }
        return this._enabled;
    }

    protected _getServiceConfig(name: string): ServiceOptions {
        return _.get(config.service, name, {
            enabled: false
        });
    }

    protected _getConfig(): ServiceOptions {
        if (!this._config) {
            this._config = this._getServiceConfig(this.name);
        }
        return this._config;
    }

    public start (callback: Function): void {
        this.active = true;
        this.log(`${ this.name } service ... ok`);
        return callback();
    }

    public stop (callback: Function): void {
        this.active = false;
        this.log(`${ this.name } service ... stopped`);
        return callback();
    }

    protected log (msg: string): void {
        // TODO logger
        console.log(`[INFO] ${ msg }`);
    }
}
