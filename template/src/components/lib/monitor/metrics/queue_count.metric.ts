/**
 * Copyright (c) 2015-2020, FineX, All Rights Reserved.
 *
 * @author kyle
 * @date 2020/6/15
 */
import { BaseMetric, Counter } from 'nstarter-metrics';

/**
 * 队列事件计数器
 */
class QueueJobCountMetric extends BaseMetric<Counter<string>> {
    protected _metric = new Counter({
        name: 'fx_queue_job_count',
        help: '队列任务事件计数',
        labelNames: ['queue', 'event']
    });

    /**
     * @param queue - 队列名称
     * @param event - 事件类型
     * @param value - 次数
     */
    public inc(queue: string, event: string, value?: number) {
        this._metric.inc({ queue, event }, value);
    }
}
export const queueJobCountMetric = new QueueJobCountMetric().register();
