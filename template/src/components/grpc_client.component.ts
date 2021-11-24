/**
 * Copyright (c) 2015-2021, FineX, All Rights Reserved.
 * @author Zed
 * @date 2021/8/6
 */

import { component } from 'nstarter-core';
import { registerGrpcClientConfig } from 'nstarter-grpc';
import { config } from '../config';
import { AbstractComponent } from './abstract.component';
import _ from 'lodash';

@component()
export class GrpcClientComponent extends AbstractComponent {

    constructor() {
        super();
        const clients = config.components.grpc.clients;
        if (clients) {
            for (const client of clients) {
                registerGrpcClientConfig({
                    package: client.package,
                    address: client.address,
                    useSsl: client.useSsl,
                    servername: client.servername
                });
            }
        }
        this.setReady(true);
    }
}
