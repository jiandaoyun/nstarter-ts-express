import { BaseComponent } from './base.component';
import { Clients } from '../rpc';
import { provideComponent } from './container';

@provideComponent()
export class RpcClientComponent extends BaseComponent {
    private _clients = Clients;

    public get clients() {
        return this._clients;
    }
}
