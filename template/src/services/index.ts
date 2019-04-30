import { container } from './container';

import { ServiceA } from './a.service';
import { ServiceB } from './b.service';

export const testA = container.get(ServiceA);
export const testB = container.get(ServiceB);
