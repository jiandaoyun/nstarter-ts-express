import { Counter } from 'prom-client';
import { BaseMonitorMetric } from '../../../core/plugins/monitor';
import { IReqLabels } from '../types';

class ReqTimeMetric extends BaseMonitorMetric<Counter> {
    protected _metric =  new Counter({
        name: 'req_time_sum',
        help: 'Total Request Time',
        labelNames: ['method', 'status', 'path']
    });

    public inc(labels: IReqLabels, time: number) {
        this._metric.inc(labels, time);
    }
}

export const reqTimeMetric = new ReqTimeMetric().register();
