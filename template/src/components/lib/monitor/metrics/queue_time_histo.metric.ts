/**
 * Copyright (c) 2015-2020, FineX, All Rights Reserved.
 *
 * @author kyle
 * @date 2020/6/15
 */
import { BaseMetric, Histogram } from 'nstarter-metrics';

/**
 * 队列执行时间分布统计
 */
class QueueJobTimeHistogramMetric extends BaseMetric<Histogram<string>> {
    protected _metric = new Histogram({
        name: 'fx_queue_job_time_histo',
        help: '队列任务时间分布',
        labelNames: ['queue'],
        buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 20, 30]
    });

    /**
     * @param queue - 队列名称
     * @param duration - 时间 (ms)
     */
    public observe(queue: string, duration: number) {
        this._metric.observe({ queue }, duration / 1000);
    }
}

export const queueJobTimeHistogramMetric = new QueueJobTimeHistogramMetric().register();
