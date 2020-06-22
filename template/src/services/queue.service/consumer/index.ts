import _ from 'lodash';
import { demoConsumer } from './demo.consumer';
import { delayConsumer } from './delay.consumer';
import { ConsumerEvents, RabbitMqConsumer } from 'nstarter-rabbitmq';
import { monitor } from '../../../components';

// 绑定消费事件监听
const listenConsumerEvents = (consumer: RabbitMqConsumer<any>) => {
    const queueName = consumer.queue.name;
    // 开始执行
    consumer.on(ConsumerEvents.run, (message) => {
        monitor.incQueueJobCount(queueName, 'run');
    });
    // 执行失败
    consumer.on(ConsumerEvents.error, (err, message) => {
        monitor.incQueueJobCount(queueName, 'fail');
    });
    // 触发重试
    consumer.on(ConsumerEvents.retry, (err, message, attempt) => {
        monitor.incQueueJobCount(queueName, 'retry');
    });
    // 执行成功完成
    consumer.on(ConsumerEvents.finish, (message) => {
        monitor.incQueueJobCount(queueName, 'success');
        if (message.duration) {
            monitor.incQueueJobTime(queueName, message.duration);
        }
    });
};

export const loadQueueConsumers = () => {
    const consumerList = [
        demoConsumer,
        delayConsumer
    ];
    _.forEach(consumerList, (consumer) => {
        consumer.register();
        listenConsumerEvents(consumer);
    });
};
