import { AbstractComponent } from './abstract.component';
import { Clients } from '../plugins/rpc';
import { provideComponent } from '../decorators';

@provideComponent()
export class RpcClientComponent extends AbstractComponent {
    private _clients = Clients;

    public get clients() {
        return this._clients;
    }
}
