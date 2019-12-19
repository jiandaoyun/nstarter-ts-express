import _ from 'lodash';
import async from 'async';
import { AmqpConnectionManager } from 'amqp-connection-manager';
import { Options } from 'amqplib';
import { promisify } from "util";
import { AbstractQueue } from './rabbitmq.base';
import {
    CustomProps, DefaultConfig,
    Priority,
    RabbitProps
} from './constants';
import { IProduceHeaders, IProduceOptions, IQueueConfig, IQueuePayload } from './types';

/**
 * 生产者实例化参数
 */
export interface IProducerConfig {
    amqp: AmqpConnectionManager;
    queueConfig: IQueueConfig;
    pushRetryTimes?: number;        // 生产端生效：消息 publish 失败后重试次数
    pushDelay?: number;              // 生产端生效：延时 publish 时间，单位：MS
    deliverTimeout?: number;        // 消费端生效：消息投递超时时长，超过时间未被消费，会被删除
    retryTimes?: number;            // 消费端生效：消费失败重试次数
    retryDelay?: number;            // 消费端生效：消费重试前的延时时间等级
}

/**
 * 队列生产者
 */
export class RabbitMQProducer<T> extends AbstractQueue {
    // 队列配置
    private readonly retryTimes: number;
    private readonly retryDelay: number;
    private readonly pushRetryTimes: number;
    private readonly pushDelay: number;
    private readonly expiration: number;

    protected readonly queueConfig: IQueueConfig;

    constructor(config: IProducerConfig) {
        super(config.amqp);
        this.queueConfig = config.queueConfig;
        this.retryTimes = config.retryTimes || 3;
        this.retryDelay = config.retryDelay || DefaultConfig.RetryDelay;
        this.pushRetryTimes = config.pushRetryTimes || 0;
        // 默认不延时发送
        this.pushDelay = config.pushDelay || 0;
        this.expiration = config.deliverTimeout || DefaultConfig.DeliverTTL;
    }

    /**
     * 格式化消息生产配置
     * @param {IProduceOptions} options
     * @return {Options.Publish}
     * @private
     */
    protected _getProduceOptions(
        options: Partial<IProduceOptions>
    ): Options.Publish {
        const opts: Options.Publish = _.defaults(
            _.omit(options, [
                'pushDelay', 'retryTimes', 'retryDelay', 'headers', 'priority'
            ]),
            {
                mandatory: true,
                persistent: true,
                deliveryMode: true
            }
        );
        const headers: IProduceHeaders = options.headers || {},
            priority = options.priority || Priority.Normal;
        const retryTimes = options.retryTimes || this.retryTimes,
            retryDelay: number = options.retryDelay || this.retryDelay;
        if (retryTimes && retryDelay) {
            // 消费重试机制
            _.set(headers, CustomProps.consumeRetryTimes, retryTimes);
            _.set(headers, CustomProps.consumeRetryDelay, retryDelay);
        }
        if (this.expiration) {
            // 设置消息过期时间（TTL），到期会自动被队列中删除，不会被消费者消费
            opts.expiration = this.expiration;
        }
        const pushDelay = options.pushDelay || this.pushDelay;
        if (pushDelay && _.isNumber(pushDelay)) {
            // 消费重试机制
            _.set(headers, RabbitProps.messageDelay, pushDelay);
        }
        // 记录发起时间
        _.set(headers, CustomProps.produceTimestamp, Date.now());
        _.extend(opts, {
            headers,
            priority
        });
        return opts;
    }

    /**
     * 消息发送
     * @param {IQueueConfig} queueConfig
     * @param {T} content
     * @param {IProduceOptions} options
     * @return {Promise<void>}
     * @private
     */
    protected async _publishWithRetry(
        queueConfig: IQueueConfig,
        content: IQueuePayload<T>,
        options: Partial<IProduceOptions>
    ): Promise<void> {
        const { exchange, routingKey } = queueConfig;
        const payload = await this.serializePayload<IQueuePayload<T>>(content),
            formatOpts: Options.Publish = this._getProduceOptions(options);
        if (!this.pushRetryTimes) {
            return this.channelWrapper
                .publish(exchange.name, routingKey, payload, formatOpts);
        }
        return promisify<void>((callback) =>
            async.retry(this.pushRetryTimes, (callback) => {
                this.channelWrapper
                    .publish(exchange.name, routingKey, payload, formatOpts)
                    .then(() => callback(),
                        (err: Error) => callback(err));
            }, callback)
        )();
    }

    /**
     * 消息发送
     * @param {IQueueConfig} queue - 队列名称
     * @param {T} content
     * @param {IProduceOptions} options
     * @return {Promise<void>}
     * @private
     */
    protected async _sendDirectWithRetry(
        queue: string,
        content: IQueuePayload<T>,
        options: Partial<IProduceOptions>
    ): Promise<void> {
        const payload = await this.serializePayload<IQueuePayload<T>>(content),
            formatOpts: Options.Publish = this._getProduceOptions(options);

        if (!this.pushRetryTimes) {
            return this.channelWrapper
                .sendToQueue(queue, payload, formatOpts);
        }
        return promisify<void>((callback) =>
            async.retry(this.pushRetryTimes, (callback) => {
                this.channelWrapper
                    .sendToQueue(queue, payload, formatOpts)
                    .then(() => callback(),
                        (err: Error) => callback(err));
            }, callback)
        )();
    }

    /**
     * 发送队列消息
     * @param {T} content - 内容
     * @param {IProduceOptions} options - 参数
     * @return {Promise<void>}
     */
    public async publish(
        content: IQueuePayload<T>,
        options?: Partial<IProduceOptions>
    ): Promise<void> {
        return this._publishWithRetry(this.queueConfig, content, options || {});
    }

    /**
     * 发送消息到指定队列
     */
    public async sendToQueue(
        content: IQueuePayload<T>,
        options?: Partial<IProduceOptions>
    ): Promise<void> {
        return this._sendDirectWithRetry(this.queueConfig.name, content, options || {});
    }
}
