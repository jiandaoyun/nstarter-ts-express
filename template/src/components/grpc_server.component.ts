import { component } from 'nstarter-core';
import { startGrpcServer } from 'nstarter-grpc';

import { AbstractComponent } from './abstract.component';
import { config } from '../config';

@component()
export class GrpcServerComponent extends AbstractComponent {
    public start() {
        startGrpcServer(config.components.grpc.server);
        this.setReady(true);
    }
}
