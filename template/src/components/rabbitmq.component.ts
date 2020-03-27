import { provideComponent, Logger } from 'nstarter-core';
import { AmqpConnector } from 'nstarter-rabbitmq';

import { config } from '../config';
import { AbstractComponent } from './abstract.component';

@provideComponent()
export class RabbitMQComponent extends AbstractComponent {
    private readonly _amqp: AmqpConnector;

    constructor() {
        super();
        this._amqp = new AmqpConnector(config.database.rabbitmq, (err) => {
            Logger.error(`Rabbitmq disconnected`, { err });
        });
        this.log();
    }

    public get amqp(): AmqpConnector {
        return this._amqp;
    }
}
