import { BaseQueue, DefaultExchangeOptions, DefaultQueueOptions, ExchangeType } from '../../../core/plugins/rabbitmq';
import { rabbitmq } from '../../../components';

export class DemoQueue<T> extends BaseQueue<T> {
    protected queueConfig = {
        name: 'demo:normal',
        routingKey: 'normal',
        options: {
            ...DefaultQueueOptions,
            durable: false,
            autoDelete: true
        }
    };

    protected exchangeConfig = {
        name: 'demo:normal',
        type: ExchangeType.fanout,
        options: {
            ...DefaultExchangeOptions,
            durable: false,
            autoDelete: true
        }
    };

    protected rabbitMq = rabbitmq.connection;
}

export const demoQueue = new DemoQueue();
