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

    public async shutdown () {}

    public isReady(): boolean {
        return this._state === ComponentState.active;
    }

    /**
     * 设置组件初始化状态
     * @param {boolean} isReady
     */
    public setReady(isReady: boolean) {
        if (isReady) {
            this._state = ComponentState.active;
            Logger.info(`init ${ this._name } ... ok`);
        } else {
            this._state = ComponentState.inactive;
            Logger.info(`shutdown ${ this._name } ... ok`);
        }
    }
}
