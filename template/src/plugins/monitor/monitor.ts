import { monitorContainer } from '../../core/monitor.container';
import { IFnLabels, IReqLabels } from './types';
import { FnCountMetric, FnTimeMetric, ReqCountMetric, ReqTimeMetric } from './metrics';

export class Monitor {
    public static recordRequest(labels: IReqLabels, time: number) {
        monitorContainer.get(ReqCountMetric).inc(labels);
        monitorContainer.get(ReqTimeMetric).inc(labels, time);
    }

    public static recordFunction(labels: IFnLabels, time: number) {
        monitorContainer.get(FnCountMetric).inc(labels);
        monitorContainer.get(FnTimeMetric).inc(labels, time);
    }
}
