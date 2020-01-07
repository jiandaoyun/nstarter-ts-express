import { provideComponent } from 'nstarter-core';

import { AbstractComponent } from './abstract.component';
import { Clients } from '../plugins/rpc';

@provideComponent()
export class RpcClientComponent extends AbstractComponent {
    private _clients = Clients;

    public get clients() {
        return this._clients;
    }
}
