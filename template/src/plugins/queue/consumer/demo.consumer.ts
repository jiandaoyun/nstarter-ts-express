import _ from 'lodash';
import { logger, rabbitmq } from '../../../components';
import { RabbitMQConsumer } from '../lib/rabbitmq.consumer';
import { DefaultConfig, ExchangeType, RabbitProps } from '../lib/constants';
import { ISubscribeMessage } from '../lib/types';

import { demoProducer } from '../producer/demo.producer';

export interface IQueueConsumer {
    startConsumer(): Promise<void>;
    stopConsumer(): Promise<void>;
}

class DelayConsumer implements IQueueConsumer {
    private readonly consumer = new RabbitMQConsumer<string>({
        amqp: rabbitmq.connection,
        queueConfig: {
            name: 'demo:delay',
            routingKey: 'delay',
            exchange: {
                name: 'demo:delay',
                type: ExchangeType.delay,
                options: {
                    ...DefaultConfig.ExchangeOptions,
                    durable: false,
                    autoDelete: true,
                    arguments: {
                        [RabbitProps.delayDeliverType]: 'direct'
                    }
                }
            },
            options: {
                ...DefaultConfig.QueueOptions,
                durable: false,
                autoDelete: true
            }
        },
        prefetch: 1
    });

    public async startConsumer(): Promise<void> {
        return this.consumer
            .subscribe((message: ISubscribeMessage<string>) => {
                const pushStamp = _.get(message, 'properties.headers.x-p-timestamp');
                logger.info(`${ message.content }, delay: ${ Date.now() - pushStamp }(ms)`);
                this.consumer
                    .ackOrRetry(null, message, demoProducer)
                    .then();
            }, { noAck: false });
    }

    public async stopConsumer(): Promise<void> {
        return this.consumer.close();
    }
}

class NormalConsumer implements IQueueConsumer {
    private readonly consumer = new RabbitMQConsumer<string>({
        amqp: rabbitmq.connection,
        queueConfig: {
            name: 'demo:normal',
            exchange: {
                name: 'demo:normal',
                type: ExchangeType.fanout,
                options: {
                    ...DefaultConfig.ExchangeOptions,
                    durable: false,
                    autoDelete: true
                }
            },
            routingKey: 'normal',
            options: {
                ...DefaultConfig.QueueOptions,
                durable: false,
                autoDelete: true
            }
        },
        prefetch: 1
    });

    public async startConsumer(): Promise<void> {
        return this.consumer
            .subscribe((message: ISubscribeMessage<string>) => {
                logger.info(message.content as string);
                this.consumer
                    .ackOrRetry(null, message, demoProducer)
                    .then();
            }, { noAck: false });
    }

    public async stopConsumer(): Promise<void> {
        return this.consumer.close();
    }
}

export const delayConsumer = new DelayConsumer();
export const normalConsumer = new NormalConsumer();
