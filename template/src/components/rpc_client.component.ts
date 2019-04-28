import { injectable } from 'inversify';
import { BaseComponent } from './base.component';
import { Components } from './items';
import { Clients } from '../rpc';

@injectable()
export class RpcClientComponent extends BaseComponent {
    protected _name = Components.rpc_client;
    private _clients = Clients;

    public get clients() {
        return this._clients;
    }
}
