import { container } from './container';
import { IFnLabels, IReqLabels } from './types';
import { FnCountMetric, FnTimeMetric, ReqCountMetric, ReqTimeMetric } from './metrics';

export class Monitor {
    public static recordRequest(labels: IReqLabels, time: number) {
        container.get(ReqCountMetric).inc(labels);
        container.get(ReqTimeMetric).inc(labels, time);
    }

    public static recordFunction(labels: IFnLabels, time: number) {
        container.get(FnCountMetric).inc(labels);
        container.get(FnTimeMetric).inc(labels, time);
    }
}
