import { DelayLevel, queueProducerFactory } from '../../../core/plugins/rabbitmq';
import { delayQueue } from '../queue';

/**
 * 延时队列生产者示例
 */
export const delayProducer = queueProducerFactory(delayQueue, {
    pushDelay: DelayLevel.level1
});
