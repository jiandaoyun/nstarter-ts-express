import { rabbitmq } from '../../../components';
import { DefaultConfig, DelayLevel, ExchangeType, RabbitProps } from '../lib/constants';
import { RabbitMQProducer } from '../lib/rabbitmq.producer';

export const demoProducer = new RabbitMQProducer({
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
    }
});

export const delayProducer = new RabbitMQProducer({
    amqp: rabbitmq.connection,
    queueConfig: {
        name: 'demo:delay',
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
        routingKey: 'delay',
        options: {
            ...DefaultConfig.QueueOptions,
            durable: false,
            autoDelete: true
        }
    },
    pushDelay: DelayLevel.level1
});
