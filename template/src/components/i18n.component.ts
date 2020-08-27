import { component } from 'nstarter-core';
import { AbstractComponent } from './abstract.component';
import { I18n } from './lib/i18n';

@component()
export class I18nComponent extends AbstractComponent {
    protected readonly _name = 'i18n';

    private readonly _i18n: I18n;

    constructor() {
        super();
        this._i18n = new I18n();
        this._i18n.init().then(() => {
            this.setReady(true);
        });
    }

    public get i18n() {
        return this._i18n;
    }
}
