import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel, Replies } from 'amqplib';
import { EventEmitter } from 'events';
import _ from 'lodash';
import { promisify } from 'util';
import {
    IAbstractQueue,
    IQueueConfig,
    IQueuePayload,
    ISetupFunc
} from './types';

/**
 * RabbitMQ 队列基类
 */
export abstract class AbstractQueue extends EventEmitter implements IAbstractQueue {
    // 独享的 channel 用于发送、接受消息
    protected assertQ: Replies.AssertQueue;
    protected assertEx: Replies.AssertExchange;
    protected prefetch: number;
    protected readonly channelWrapper: ChannelWrapper;
    protected abstract readonly queueConfig: IQueueConfig;

    protected constructor(amqp: AmqpConnectionManager) {
        super();
        this.channelWrapper = amqp.createChannel({
            json: false,
            setup: this._setupFunc()
        });

        this.channelWrapper
            // @ts-ignore
            .waitForConnect(() => this.emit('connect'));
    }

    /**
     * 通过特色方式获取 ChannelWrapper 内部的 channel
     * @return {Promise<ConfirmChannel>}
     */
    protected get channel(): Promise<ConfirmChannel> {
        return promisify<ConfirmChannel>((callback) =>
            this.channelWrapper
                .removeSetup(_.noop, (ch: ConfirmChannel) => {
                    callback(null, ch);
                })
        )();
    }

    /**
     * 启动、重连加载逻辑
     * @desc 注册到 amqp 内部的 setups 队列中，启动或重连时调用
     * @return {ISetupFunc}
     * @protected
     */
    protected _setupFunc(): ISetupFunc {
        return async (channel: ConfirmChannel): Promise<any> => {
            const { name, options, routingKey, exchange } = this.queueConfig;
            this.assertQ = await channel.assertQueue(name, options);
            if (this.prefetch) {
                await channel.prefetch(this.prefetch);
            }
            this.assertEx = await channel.assertExchange(exchange.name, exchange.type, exchange.options);
            await channel.bindQueue(this.assertQ.queue, this.assertEx.exchange, routingKey);
        };
    }

    /**
     * 序列化 RabbitMQ 消息
     * @public
     */
    public async serializePayload<T>(
        content: T
    ): Promise<Buffer> {
        return Buffer.from(JSON.stringify(content));
    }

    /**
     * 反序列化 RabbitMQ 消息
     * @public
     */
    public async deserializePayload<T>(
        content: Buffer
    ): Promise<IQueuePayload<T>> {
        let result: IQueuePayload<T>;
        try {
            result = JSON.parse(_.toString(Buffer.from(content)));
        } catch (e) {
            result = {} as IQueuePayload<T>;
        }
        return result;
    }

    /**
     * 等待队列初始化完成
     * @return {Promise<void>}
     */
    public async waitForSetup(): Promise<void> {
        return this.channelWrapper
            // @ts-ignore
            .waitForConnect();
    }

    /**
     * 关闭链接
     * @return {Promise<void>}
     */
    public async close(): Promise<void> {
        return this.channelWrapper
            .close();
    }
}
