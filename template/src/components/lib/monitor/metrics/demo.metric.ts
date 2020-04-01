import { BaseMetric, Counter } from 'nstarter-metrics';
import { IDemoLabels } from '../../../../types/metrics';

class DemoMetric extends BaseMetric<Counter> {
    protected _metric = new Counter({
        name: 'demo_count',
        help: 'Demo event count',
        labelNames: ['type']
    });

    public inc(labels: IDemoLabels) {
        this._metric.inc(labels, 1);
    }
}

export const demoMetric = new DemoMetric().register();
