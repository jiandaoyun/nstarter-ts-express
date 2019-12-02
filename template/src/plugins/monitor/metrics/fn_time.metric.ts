import { Counter } from 'prom-client';
import { BaseMetric } from './base.metric';
import { IFnLabels } from '../types';
import { provideMetric } from '../container';

@provideMetric()
export class FnTimeMetric extends BaseMetric<Counter> {
    constructor() {
        super();
        this._metric = new Counter({
            name: 'fn_time_sum',
            help: 'Total Function Call Time',
            labelNames: ['method', 'class']
        });
    }

    public inc(labels: IFnLabels, time: number) {
        this._metric.inc(labels, time);
    }
}
