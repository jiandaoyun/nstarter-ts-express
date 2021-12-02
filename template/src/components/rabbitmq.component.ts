import { BaseComponent, component, Logger } from 'nstarter-core';
import { AmqpConnector, stopQueueConsumers } from 'nstarter-rabbitmq';

import { config } from '../config';

@component()
export class RabbitMqComponent extends BaseComponent {
    private readonly _amqp: AmqpConnector;

    constructor() {
        super();
        this._amqp = new AmqpConnector(config.components.rabbitmq, (err: Error) => {
            Logger.error(`Rabbitmq disconnected`, { err });
        });
        if (this._amqp.connection.isConnected()) {
            this.setReady(true);
        } else {
            this._amqp.connection.once('connect', () => {
                this.setReady(true);
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
