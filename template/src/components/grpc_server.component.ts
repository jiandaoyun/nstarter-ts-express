import { component } from 'nstarter-core';
import { startGrpcServer } from 'nstarter-grpc';
import { config } from '../config';

import { AbstractComponent } from './abstract.component';

@component()
export class GrpcServerComponent extends AbstractComponent {

    constructor() {
        super();
        this.setReady(true);
    }

    public async start() {
        await startGrpcServer(config.components.grpc.server);
    }
}
