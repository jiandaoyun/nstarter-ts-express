import { BaseComponent, component } from 'nstarter-core';
import { I18n } from './lib/i18n';

@component()
export class I18nComponent extends BaseComponent {
    protected readonly _name = 'i18n';

    private readonly _i18n: I18n;

    constructor() {
        super();
        this._i18n = new I18n();
    }

    public async init() {
        await this.i18n.init();
        this.setReady(true);
    }

    public get i18n() {
        return this._i18n;
    }
}
