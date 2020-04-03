import { provideComponent } from 'nstarter-core';
import { startGrpcServer } from 'nstarter-grpc';

import { AbstractComponent } from './abstract.component';
import { config } from '../config';

@provideComponent()
export class GrpcServerComponent extends AbstractComponent {
    public start() {
        startGrpcServer(config.components.grpc.server);
        this.log();
    }
}
