import { demoQueue } from '../queue';
import { queueProducerFactory } from '../../../core/plugins/rabbitmq';

/**
 * 示例队列生产者
 */
export const demoProducer = queueProducerFactory(demoQueue);
