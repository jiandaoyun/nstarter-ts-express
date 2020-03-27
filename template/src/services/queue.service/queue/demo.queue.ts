import { ExchangeType, queueFactory } from 'nstarter-rabbitmq';
import { amqp } from '../../../components';

/**
 * 队列任务示例
 */
export const demoQueue = queueFactory(amqp.connection, {
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
