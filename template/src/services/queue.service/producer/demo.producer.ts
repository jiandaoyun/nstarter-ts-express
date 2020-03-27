import { demoQueue } from '../queue';
import { queueProducerFactory } from 'nstarter-rabbitmq';

/**
 * 示例队列生产者
 */
export const demoProducer = queueProducerFactory(demoQueue);
