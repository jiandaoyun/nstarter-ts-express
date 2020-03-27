import _ from 'lodash';
import { provideComponent, Logger } from 'nstarter-core';
import { AmqpConnector, IQueueConsumer, queueConsumerRegistry } from 'nstarter-rabbitmq';

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
