import { BaseComponent, component } from 'nstarter-core';
import { startGrpcServer } from 'nstarter-grpc';
import { config } from '../config';


@component()
export class GrpcServerComponent extends BaseComponent {

    public async init() {
        await startGrpcServer(config.components.grpc.server);
        this.setReady(true);
    }
}
