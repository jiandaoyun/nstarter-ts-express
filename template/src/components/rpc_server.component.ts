import { injectable } from 'inversify';
import { Server } from 'grpc';

import { BaseComponent } from './base.component';
import { Components } from './items';
import { server } from '../rpc';

@injectable()
export class RpcServerComponent extends BaseComponent {
    protected _name = Components.rpc_server;
    private _server: Server;

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
