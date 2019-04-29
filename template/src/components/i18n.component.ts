import { injectable } from 'inversify';
import 'reflect-metadata';

import { BaseComponent } from './base.component';
import { Components } from './items';
import { I18n } from './lib/i18n';

@injectable()
export class I18nComponent extends BaseComponent {
    protected _name = Components.i18n;
    private _i18n: I18n;

    constructor() {
        super();
        this._i18n = new I18n();
        this._i18n.init(() => {});
        this.log();
    }

    get i18n() {
        return this._i18n;
    }
}
