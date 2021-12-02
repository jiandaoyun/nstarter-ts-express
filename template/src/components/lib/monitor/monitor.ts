import { IReqLabels, MetricsMonitor as NsMetricsMonitor } from 'nstarter-metrics';

import {
    demoMetric,
    IDemoLabels,
    //#module rabbitmq
    queueJobCountMetric,
    queueJobTimeHistogramMetric,
    queueJobTimeMetric
    //#endmodule rabbitmq
} from './metrics';

/**
 * 监控指标扩展注册
 */
export class MetricsMonitor extends NsMetricsMonitor {
    /**
     * 覆盖指标记录方法
     * @param labels
     * @param time
     */
    public recordRequest(labels: IReqLabels, time: number) {
        super.recordRequest(labels, time);

    }

    /**
     * 示例指标记录方法
     * @param labels
     */
    public recordDemo(labels: IDemoLabels) {
        demoMetric.inc(labels);
    }
    //#module rabbitmq

    /**
     * 记录队列事件计数
     * @param queue - 队列名称
     * @param event - 事件类型
     * @static
     */
    public incQueueJobCount(queue: string, event: string): void {
        queueJobCountMetric.inc(queue, event);
    }

    /**
     * 队列任务执行时间记录
     * @param queue - 队列名称
     * @param duration - 执行时间
     */
    public incQueueJobTime(queue: string, duration: number): void {
        queueJobTimeMetric.inc(queue, duration);
        queueJobTimeHistogramMetric.observe(queue, duration);
    }
    //#endmodule rabbitmq
}

export const metricsMonitor = new MetricsMonitor();
