import { BaseMetric } from './base.metric';
import { Counter } from 'prom-client';
import { IReqLabels } from '../types';
import { provideMetric } from '../../../decorators';

@provideMetric()
export class ReqCountMetric extends BaseMetric<Counter> {
    constructor() {
        super();
        this._metric = new Counter({
            name: 'req_count_sum',
            help: 'Total Request Count',
            labelNames: ['method', 'status', 'path']
        });
    }

    public inc(labels: IReqLabels) {
        this._metric.inc(labels);
    }
}
