import { queueFactory } from 'nstarter-rabbitmq';
import { amqp } from '../../../components';

/**
 * 队列任务示例
 */
export const demoQueue = queueFactory(amqp.connection, {
    name: 'demo:normal',
    maxLength: 10,
    prefetch: 1
});
