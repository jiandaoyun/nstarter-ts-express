import { BaseMetric } from './base.metric';
import { Counter } from 'prom-client';
import { IFnLabels } from '../types';
import { provideMetric } from '../../../decorators';

@provideMetric()
export class FnCountMetric extends BaseMetric<Counter> {
    constructor() {
        super();
        this._metric = new Counter({
            name: 'fn_count_sum',
            help: 'Total Function Call Count',
            labelNames: ['method', 'class']
        });
    }

    public inc(labels: IFnLabels) {
        this._metric.inc(labels);
    }
}
