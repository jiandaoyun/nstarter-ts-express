import { AbstractComponent } from './abstract.component';
import { I18n } from './lib/i18n';
import { provideComponent } from '../decorators';

@provideComponent()
export class I18nComponent extends AbstractComponent {
    private readonly _i18n: I18n;

    constructor() {
        super();
        this._i18n = new I18n();
        this._i18n.init();
        this.log();
    }

    public get i18n() {
        return this._i18n;
    }
}
