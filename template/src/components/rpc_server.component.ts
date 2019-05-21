import { Server } from 'grpc';

import { BaseComponent } from './base.component';
import { server } from '../plugins/rpc';
import { provideComponent } from './container';

@provideComponent()
export class RpcServerComponent extends BaseComponent {
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
