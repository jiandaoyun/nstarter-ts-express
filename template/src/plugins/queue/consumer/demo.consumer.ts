import async from 'async';
import { Exchange, ExchangeType, FetchMessage, Queue, RabbitMQMessage } from '../interface';
import { BaseConsumer, RabbitMQConsumer } from '../queue';

class DemoConsumer extends BaseConsumer {
    public name = 'consumer:fetch:demo';
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

    private _next(isWait?: boolean): void {
        if (isWait) {
            setTimeout(() => {
                this._next();
            }, 500);
        } else {
            process.nextTick(() => {
                this.consume();
            });
        }
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
        let isWait = false;
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
                this._consumer.fetch({
                    exclusive: true,
                    noAck: false
                }, (err: Error, message: FetchMessage | false): void => {
                    if (err) {
                        return callback(err);
                    }
                    if (!message) {
                        // 没有消息等待 500 ms
                        isWait = true;
                        return callback();
                    }
                    console.log(`${ this.name }`, message.content);
                    this._consumer.ack(message as RabbitMQMessage);
                    return callback();
                });
            }]
        }, (err?: Error): void => {
            if (err) {
                console.log(err);
                this.emit('error', err);
            }
            // 解锁
            this._release(() => {
                this._next(isWait);
            });
        });
    }

    public close(callback: Callback): void {
        async.auto<{
            close: void,
            release: void
        }>({
            // 停止
            close: (callback) => {
                this._consumer.close((err: Error): void => {
                    if (err) {
                        return callback(err);
                    }
                    super.close(callback);
                });
            },
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

export const demoConsumer = new DemoConsumer();
