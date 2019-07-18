import { Counter } from 'prom-client';
import { BaseMetric } from './base.metric';
import { ReqLabels } from '../types';
import { provideMetric } from '../container';

@provideMetric()
export class ReqTimeMetric extends BaseMetric<Counter> {
    constructor() {
        super();
        this._metric = new Counter({
            name: 'req_time_sum',
            help: 'Total Request Time',
            labelNames: ['method', 'status', 'path']
        });
    }

    public inc(labels: ReqLabels, time: number) {
        this._metric.inc(labels, time);
    }
}
