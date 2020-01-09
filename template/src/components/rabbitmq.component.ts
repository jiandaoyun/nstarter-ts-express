import _ from 'lodash';
import { provideComponent } from 'nstarter-core';

import { config } from '../config';
import { AbstractComponent } from './abstract.component';
import { AmqpConnector } from './lib/rabbitmq/amqp.connection';
import { IQueueConsumer, queueConsumerRegistry } from '../core/plugins/rabbitmq';

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

    /**
     * 队列消费者启动方法
     */
    public async startConsumer(): Promise<void> {
        await Promise.all(_.map(queueConsumerRegistry,
            (consumer: IQueueConsumer<any>) => consumer.start()
        ));
        return;
    }
}
