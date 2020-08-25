import { injectable } from 'inversify';

import { Logger } from 'nstarter-core';

export enum ComponentState {
    inactive,
    active
}

@injectable()
export abstract class AbstractComponent {
    protected _name: string;
    protected _state: ComponentState = ComponentState.inactive;

    public async shutdown () {

    }

    public get ready(): boolean {
        return this._state === ComponentState.active;
    }

    /**
     * 设置主键状态
     * @param {boolean} isReady
     */
    public set ready(isReady: boolean) {
        if (isReady) {
            this._state = ComponentState.active;
            Logger.info(`${ this._name } initialized.`);
        } else {
            this._state = ComponentState.inactive;
            Logger.info(`${ this._name } shutdown.`);
        }
    }
}
