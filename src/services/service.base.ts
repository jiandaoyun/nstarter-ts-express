import _ from 'lodash';
import { config, ServiceConfig } from '../config';

export abstract class BaseService {
    public abstract name: string;
    public wanted: string[] = [];

    public active = false;
    protected _config: ServiceConfig;
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

    protected _getServiceConfig(name: string): ServiceConfig {
        return _.get(config.service, name, {
            enabled: false
        });
    }

    protected _getConfig(): ServiceConfig {
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
