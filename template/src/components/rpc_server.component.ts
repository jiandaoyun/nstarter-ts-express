import { Server } from 'grpc';

import { AbstractComponent } from './abstract.component';
import { server } from '../plugins/rpc';
import { provideComponent } from '../decorators';

@provideComponent()
export class RpcServerComponent extends AbstractComponent {
    protected _name: string;

    private readonly _server: Server;

    constructor() {
        super();
        this._server = server;
        this._server.start();
        this.log();
    }

    public get server() {
        return this._server;
    }
}
