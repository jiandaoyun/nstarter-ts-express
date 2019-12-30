import {
    ExchangeType,
    RabbitProps,
    BaseQueue,
    DefaultQueueOptions,
    DefaultExchangeOptions
} from '../../../core/plugins/rabbitmq';
import { rabbitmq } from '../../../components';

class DelayQueue<T> extends BaseQueue<T> {
    protected queueConfig = {
        name: 'demo:delay',
        routingKey: 'delay',
        options: {
            ...DefaultQueueOptions,
            durable: false,
            autoDelete: true
        }
    };

    protected exchangeConfig = {
        name: 'demo.delay',
        type: ExchangeType.delay,
        options: {
            ...DefaultExchangeOptions,
            durable: false,
            autoDelete: false,
            arguments: {
                [RabbitProps.delayDeliverType]: 'direct'
            }
        }
    };

    protected prefetch = 1;

    protected rabbitMq = rabbitmq.connection;
}

export const delayQueue = new DelayQueue();
