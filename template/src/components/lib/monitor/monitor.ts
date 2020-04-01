import { IReqLabels, MetricsMonitor as NsMetricsMonitor } from 'nstarter-metrics';
import { IDemoLabels } from '../../../types/metrics';
import { demoMetric } from './metrics';

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
}

export const metricsMonitor = new MetricsMonitor();
