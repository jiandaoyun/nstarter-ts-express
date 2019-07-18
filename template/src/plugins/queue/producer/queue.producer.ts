import { Channel, ConfirmChannel } from 'amqplib/callback_api';
import async from 'async';
import { EventEmitter } from 'events';
import { Errors } from '../../../errors';

import {
    ChannelMode,
    Exchange,
    ProduceImpl,
    ProduceOptions, ProducerImpl,
    Queue,
    RabbitMQChannel,
    TaskOptions,
    TaskPayload
} from '../interface';
import { RabbitMQBase } from '../queue';

/**
 * @class RabbitMQProducer
 * @extends RabbitMQBase
 */
export class RabbitMQProducer extends RabbitMQBase implements ProduceImpl<Queue, ProduceOptions> {
    private readonly _mode: ChannelMode;

    constructor(mode?: ChannelMode) {
        super();
        this._mode = mode || ChannelMode.normal;
    }

    public init(
        callback: Callback
    ): void {
        if (!this._connection) {
            return callback(Errors.database(100));
        }
        if (this._mode === ChannelMode.confirm) {
            // Confirm 模式
            this._connection
                .createConfirmChannel((err: Error, channel: RabbitMQChannel): void => {
                    if (err) {
                        return callback(err);
                    }
                    this.channel = channel;
                    return callback();
                });
        } else {
            super._createChannel(callback);
        }
    }

    /**
     * 发送消息到指定 exchange、routingKey
     */
    public publish(
        queue: Queue,
        content: any,
        options: ProduceOptions,
        callback: Callback
    ): void {
        const { exchange, routingKey } = queue;
        async.auto<{
            exchange: Exchange,
            sendMessage: void
        }>({
            exchange: (callback) => {
                this._assertExchange(exchange, callback);
            },
            sendMessage: ['exchange', (results, callback) => {
                this._sendMessage(exchange.name, routingKey, content, options, callback);
            }]
        }, (err) => callback(err));
    }

    /**
     * 发送消息到指定队列
     */
    public sendToQueue(
        queue: Queue,
        content: any,
        options: ProduceOptions,
        callback: Callback
    ): void {
        async.auto<{
            queue: Queue,
            sendMessage: void
        }>({
            queue: (callback) => {
                this._assertQueue(queue, callback);
            },
            sendMessage: ['queue', (results, callback) => {
                const { routingKey } = results.queue;
                this._sendMessage('', routingKey, content, options, callback);
            }]
        }, (err) => callback(err));
    }

    /**
     * 发送消息到指定 exchange、routingKey
     */
    private _sendMessage(
        exchange: string,
        routingKey: string,
        content: any,
        options: ProduceOptions,
        callback: Callback
    ): void {
        const payload: Buffer = Buffer.from(JSON.stringify(content));
        if (this._mode === ChannelMode.confirm) {
            (this.channel as ConfirmChannel)
                .publish(exchange, routingKey, payload, options, (err?: Error) => {
                    if (err) {
                        return callback(err);
                    }
                    return callback();
                });
        } else {
            (this.channel as Channel).publish(exchange, routingKey, payload, options);
            return callback();
        }
    }
}

export abstract class BaseProducer<P extends TaskPayload = TaskPayload, O extends TaskOptions = TaskOptions>
    extends EventEmitter implements ProducerImpl<P, O> {
    protected _running: boolean;

    public init(
        callback: Callback
    ): void {
        this._running = true;
        this.emit('init', this.name);

        callback();
    }

    public abstract produce(message: P, options: O | null, callback?: Callback): void;

    public close(
        callback: Callback
    ): void {
        this._running = false;
        this.emit('close', this.name);

        return callback();
    }

    public abstract name: string;
}
