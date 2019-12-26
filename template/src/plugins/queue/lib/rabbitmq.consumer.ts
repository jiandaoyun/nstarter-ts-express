import _ from 'lodash';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage, GetMessage, Options } from 'amqplib';
import { logger } from '../../../components';
import { RabbitMQProducer } from './rabbitmq.producer';
import { AbstractQueue } from './rabbitmq.base';
import { CustomProps, DefaultConfig, DelayLevel } from './constants';
import {
    IQueuePayload,
    IQueueConfig,
    IConsumeOptions,
    IMessageHandler, ISubscribeMessage, IFetchMessage, IProduceHeaders
} from './types';

export interface IConsumerConfig {
    amqp: AmqpConnectionManager;
    queueConfig: IQueueConfig;
    prefetch: number;
    retryTimes?: number;
    retryDelay?: DelayLevel;
}

export class RabbitMQConsumer<T> extends AbstractQueue {
    private consumeTag: string;
    private retryDelay: DelayLevel;
    private readonly retryTimes: number;
    protected readonly queueConfig: IQueueConfig;

    constructor(config: IConsumerConfig) {
        super(config.amqp);
        this.queueConfig = config.queueConfig;
        this.retryTimes = config.retryTimes || DefaultConfig.RetryTimes;
        this.retryDelay = config.retryDelay || DefaultConfig.RetryDelay;
        this.prefetch = config.prefetch || DefaultConfig.Prefetch;
    }

    /**
     * PULL 模式，拉取一条队列消息
     */
    public async fetch(
        options: IConsumeOptions
    ): Promise<IQueuePayload<T>> {
        const channel: ConfirmChannel = await this.channel;
        const message: false | GetMessage = await channel.get(
            this.assertQ.queue,
            RabbitMQConsumer._getFetchOptions(options)
        );
        if (!message) {
            return {} as any;
        }
        // 有效消息，反序列化
        return super.deserializePayload<T>(message.content);
    }

    /**
     * PUSH 模式，订阅队列消息
     */
    public async subscribe(
        messageHandler: IMessageHandler<T>,
        options: IConsumeOptions
    ): Promise<void> {
        await this.waitForSetup();
        return this.channelWrapper
            .addSetup(async(channel: ConfirmChannel) => {
                const result = await channel.consume(
                    this.assertQ.queue,
                    async (message: ConsumeMessage | null) => {
                        if (!message) {
                            return;
                        }
                        const payload: ISubscribeMessage<T> = _.defaults({
                            content: await super.deserializePayload<T>(message.content)
                        }, message);
                        process.nextTick(() => messageHandler(payload));
                    },
                    RabbitMQConsumer._getConsumeOptions(options)
                );
                this.consumeTag = result.consumerTag;
            });
    }

    /**
     * 取消消息订阅
     */
    public async unsubscribe(): Promise<any> {
        if (!this.consumeTag) {
            return;
        }
        const channel: ConfirmChannel = await this.channel;
        return channel.cancel(this.consumeTag);
    }

    public ack(
        message: IFetchMessage<T> | ISubscribeMessage<T>,
        allUpTo?: boolean
    ): void {
        this.channelWrapper
            .ack(message as any, allUpTo);
    }

    public nack(
        message: IFetchMessage<T> | ISubscribeMessage<T>,
        allUpTo?: boolean,
        requeue?: boolean
    ): void {
        this.channelWrapper
            .nack(message as any, allUpTo, requeue);
    }

    /**
     * 调用消息生产者，重新添加到 rabbitmq 队列
     * @param {Error} err
     * @param {RabbitMQProducer} producer
     * @param {IFetchMessage | ISubscribeMessage} message
     */
    public async ackOrRetry<P extends RabbitMQProducer<T>>(
        err: Error | undefined | null,
        message: IFetchMessage<T> | ISubscribeMessage<T>,
        producer: P
    ): Promise<void> {
        if (!err) {
            // 正确处理完成，ACK
            return this.ack(message);
        }
        const headers = _.get(message.properties, 'headers', {}),
            pushDelay = _.get(headers, CustomProps.consumeRetryDelay),
            times = _.get(headers, CustomProps.consumeRetryTimes, 0) + 1;
        if (!this.retryTimes || times > this.retryTimes) {
            // 不需要重试、重试机会使用完毕，队列 ACK 删除消息（防止无限重复消费）
            logger.warn(err);
            return this.ack(message);
        }
        // 配置了 producer，调整重试参数，添加回队列，并删除原消息
        try {
            const publishHeaders: IProduceHeaders = _.defaults(
                {
                    [CustomProps.produceTimestamp]: Date.now(),
                    [CustomProps.consumeRetryTimes]: times,
                },
                _.pick<IProduceHeaders>(headers, _.values(CustomProps))
            );
            await producer.publish(message.content, {
                mandatory: true,
                persistent: true,
                deliveryMode: true,
                headers: publishHeaders,
                pushDelay
            });
            this.ack(message);
        } catch (e) {
            this.nack(message);
        }
        return;
    }

    /**
     * 格式化拉取模式参数配置
     * @private
     */
    private static _getFetchOptions(options: IConsumeOptions): Options.Get {
        return _.defaults(options, {
            noAck: true
        });
    }

    /**
     * 格式化订阅模式参数配置
     * @private
     */
    private static _getConsumeOptions(options: IConsumeOptions): Options.Consume {
        return _.defaults(options, {
            noAck: true
        });
    }
}
