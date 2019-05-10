import { container } from './container';
import { ReqLabels } from './types';
import { ReqCountMetric, ReqTimeMetric } from './metrics';

export class Monitor {
    public static recordRequest(labels: ReqLabels, time: number) {
        container.get(ReqCountMetric).inc(labels);
        container.get(ReqTimeMetric).inc(labels, time);
    }
}
