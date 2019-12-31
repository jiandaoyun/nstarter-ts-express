import { ExchangeType, queueFactory } from '../../../core/plugins/rabbitmq';
import { rabbitmq } from '../../../components';

/**
 * 队列任务示例
 */
export const demoQueue = queueFactory(rabbitmq.connection, {
    queue: {
        name: 'demo:normal',
        routingKey: 'normal',
        options: {
            durable: false,
            autoDelete: true
        }
    },
    exchange: {
        name: 'demo:normal',
        type: ExchangeType.fanout,
        options: {
            durable: false,
            autoDelete: true
        }
    }
});
