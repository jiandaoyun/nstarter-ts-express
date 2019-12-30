import { Metric } from 'prom-client';

export abstract class BaseMetric<T extends Metric> {
    protected _metric: T;

    public get metric() {
        return this._metric;
    }
}

