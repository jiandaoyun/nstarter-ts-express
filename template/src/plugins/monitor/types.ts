import { labelValues } from 'prom-client';

export interface ReqLabels extends labelValues {
    method: string,
    status: number,
    path: string,
}
