import { queueProducerFactory } from 'nstarter-rabbitmq';
import { delayQueue } from '../queue';
import { QueueConsts } from '../../../constants';

/**
 * 延时队列生产者示例
 */
export const delayProducer = queueProducerFactory(delayQueue, {
    pushDelay: QueueConsts.DemoPushDelay
});
