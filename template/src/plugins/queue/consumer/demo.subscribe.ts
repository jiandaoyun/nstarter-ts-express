import async from 'async';
import { Exchange, ExchangeType, Queue, RabbitMQMessage, SubscribeMessage } from '../interface';
import { BaseConsumer, RabbitMQConsumer } from '../queue';

class DemoSubscribe extends BaseConsumer {
    public name = 'consumer:subscribe:demo';
    private readonly _consumer: RabbitMQConsumer;
    private _hasLock: boolean;

    private readonly exchange: Exchange = {
        name: 'demo',
        type: ExchangeType.fanout,
        options: {
            durable: true,
            autoDelete: false,
            internal: false,
            alternateExchange: 'demo:not_routed'
        }
    };

    private readonly queue: Queue = {
        name: '',
        exchange: this.exchange,
        routingKey: '',
        options: {
            exclusive: true,
            durable: false,
            autoDelete: true
        }
    };

    constructor() {
        super();
        this._hasLock = false;
        this._consumer = new RabbitMQConsumer({
            queue: this.queue
        });
    }

    /**
     * 获取锁
     * @param {Function} callback - 回调函数
     * @private
     */
    private _acquire(callback: Function) {
        this.emit('acquire');
        this._hasLock = true;
        return callback();
    }

    /**
     * 释放锁
     * @param {Function} callback - 回调函数
     * @private
     */
    private _release(callback: Function) {
        this.emit('release');
        this._hasLock = false;
        return callback();
    }

    public init(callback: Callback): void {
        async.auto<{
            init: void
        }>({
            // 初始化 Consumer
            init: (callback) => {
                this._consumer.init((err) => {
                    if (err) {
                        return callback(err);
                    }
                    super.init(callback);
                });
            }
        }, (err: Error): void => {
            if (err) {
                return callback(err);
            }
            process.nextTick((): void => {
                this.consume();
            });
            return callback();
        });
    }

    public consume(): void {
        async.auto<{
            acquire: void,
            consume: void
        }>({
            // 加锁
            acquire: (callback) => {
                this._acquire(callback);
            },
            // 运行
            consume: ['acquire', (results, callback) => {
                this._consumer.subscribe({
                    exclusive: false,
                    noAck: false
                }, (err: Error, message: SubscribeMessage): void => {
                    if (err) {
                        this.emit('error', err);
                        return;
                    }
                    if (!message) {
                        return;
                    }
                    console.log(`${ this.name } `, message.content);
                    this._consumer.ack(message as RabbitMQMessage);
                });
                return callback();
            }]
        }, (err?: Error): void => {
            if (err) {
                console.log(err);
                this.emit('error', err);
            }
            // 解锁
            this._release(() => {});
        });
    }

    public close(callback: Callback): void {
        async.auto<any>({
            unsubscribe: (callback) => {
                this._consumer.unsubscribe((err: Error) => {
                    if (err) {
                        return callback(err);
                    }
                    return callback();
                });
            },
            // 停止
            close: ['unsubscribe', (results, callback) => {
                this._consumer.close((err: Error): void => {
                    if (err) {
                        return callback(err);
                    }
                    super.close(callback);
                });
            }],
            // 释放锁(如果持有锁)
            release: ['close', (results, callback: Function): void => {
                if (!this._hasLock) {
                    return callback();
                }
                this._release(callback);
            }]
        }, (err?: Error): void => callback(err));
    }
}

export const demoSubscribe = new DemoSubscribe();
