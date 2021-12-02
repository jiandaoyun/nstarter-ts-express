import { BaseComponent, component } from 'nstarter-core';
import { startGrpcServer } from 'nstarter-grpc';
import { config } from '../config';


@component()
export class GrpcServerComponent extends BaseComponent {

    constructor() {
        super();
        this.setReady(true);
    }

    public async start() {
        await startGrpcServer(config.components.grpc.server);
    }
}
