import { queueFactory } from 'nstarter-rabbitmq';
import { amqp } from '../../../components';

/**
 * 延时队列示例
 */
export const delayQueue = queueFactory(amqp.connection, {
    name: 'demo:delay',
    isDelay: true,
    maxLength: 10,
    prefetch: 1
});
