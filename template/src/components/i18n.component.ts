import { BaseComponent } from './base.component';
import { I18n } from './lib/i18n';
import { provideComponent } from './container';

@provideComponent('i18n')
export class I18nComponent extends BaseComponent {
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
