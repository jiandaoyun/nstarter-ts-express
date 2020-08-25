import { component, Logger } from 'nstarter-core';
import { AmqpConnector, stopQueueConsumers } from 'nstarter-rabbitmq';

import { config } from '../config';
import { AbstractComponent } from './abstract.component';

@component()
export class RabbitMqComponent extends AbstractComponent {
    private readonly _amqp: AmqpConnector;

    constructor() {
        super();
        this._amqp = new AmqpConnector(config.database.rabbitmq, (err) => {
            Logger.error(`Rabbitmq disconnected`, { err });
        });
        if (this._amqp.connection.isConnected()) {
            this.ready = true;
        } else {
            this._amqp.connection.once('connect', () => {
                this.ready = true;
            });
        }
    }

    public get amqp(): AmqpConnector {
        return this._amqp;
    }

    public async shutdown() {
        await stopQueueConsumers();
    }
}
