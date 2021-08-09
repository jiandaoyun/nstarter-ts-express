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

    public start() {
        startGrpcServer(config.components.grpc.server);
    }
}
