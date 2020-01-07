import { provideComponent } from 'nstarter-core';

import { config } from '../config';
import { AbstractComponent } from './abstract.component';
import { AmqpConnector } from './lib/database/amqp.connection';

@provideComponent()
export class RabbitMQComponent extends AbstractComponent {
    private readonly _amqp: AmqpConnector;

    constructor() {
        super();
        this._amqp = new AmqpConnector(config.database.rabbitmq);
        this.log();
    }

    public get amqp(): AmqpConnector {
        return this._amqp;
    }
}
