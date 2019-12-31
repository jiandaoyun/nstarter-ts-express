import { ExchangeType, RabbitProps, queueFactory } from '../../../core/plugins/rabbitmq';
import { rabbitmq } from '../../../components';

/**
 * 延时队列示例
 */
export const delayQueue = queueFactory(rabbitmq.connection, {
    queue: {
        name: 'demo:delay',
        routingKey: 'delay',
        options: {
            durable: false,
            autoDelete: true
        }
    },
    exchange: {
        name: 'demo.delay',
        type: ExchangeType.delay,
        options: {
            durable: false,
            autoDelete: false,
            arguments: {
                [RabbitProps.delayDeliverType]: 'direct'
            }
        }
    },
    prefetch: 1
});
