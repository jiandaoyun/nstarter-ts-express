/**
 * Copyright (c) 2015-2020, FineX, All Rights Reserved.
 *
 * @author kyle
 * @date 2020/6/15
 */
import { BaseMetric, Counter } from 'nstarter-metrics';

/**
 * 队列执行事件计数
 */
class QueueJobTimeMetric extends BaseMetric<Counter<string>> {
    protected _metric = new Counter({
        name: 'fx_queue_job_time',
        help: '队列任务执行时间',
        labelNames: ['queue']
    });

    /**
     * @param queue - 队列名称
     * @param duration - 时间 (ms)
     */
    public inc(queue: string, duration: number) {
        this._metric.inc({ queue }, duration);
    }
}
export const queueJobTimeMetric = new QueueJobTimeMetric().register();
