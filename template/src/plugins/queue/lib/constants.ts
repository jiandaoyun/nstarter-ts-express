/**
 * Exchange 类型
 */
export enum ExchangeType {
    topic = 'topic',
    headers = 'headers',
    fanout = 'fanout',
    direct = 'direct',
    delay = 'x-delayed-message'
}

/**
 * 默认任务优先级：[-100, 100]
 */
export enum Priority {
    Low = -50,
    Normal = 0,
    Medium = 50,
    High = 80,
    Critical = 100
}

/**
 * RabbitMQ 内置参数、headers
 */
export enum RabbitProps {
    deadLetterExchange = 'x-dead-letter-exchange',           // 死信 Exchange 名称
    messageTtl = 'x-message-ttl',                            // 队列消息 TTL 延时，单位：MS
    messageDelay = 'x-delay',                                // 队列消息动态延时，单位：MS
    delayDeliverType = 'x-delayed-type'                      // 延时消息 Exchange 分发规则
}

/**
 * 自定义消息 headers
 */
export enum CustomProps {
    produceTimestamp = 'x-p-timestamp',                      // 消息生产时间戳
    consumeRetryTimes = 'x-retry-times',                     // 消费重试次数
    consumeRetryDelay = 'x-retry-delay'                      // 消费重试延时，单位：MS
}

/**
 * RabbitMQ 默认配置
 */
export const DefaultConfig = {
    // 消息消费默认 TTL，单位：ms
    DeliverTTL: 60000,
    // 默认延时，单位：ms
    RetryDelay: 10000,
    // Exchange 申明参数
    ExchangeOptions: {
        durable: true,
        autoDelete: false,
        internal: false,
        alternateExchange: 'jdy.rabbitmq.default_aex'
    },
    // Queue 申明参数
    QueueOptions: {
        exclusive: false,
        durable: true,
        autoDelete: false
    }
};
