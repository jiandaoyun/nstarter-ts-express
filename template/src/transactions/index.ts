import { container } from './container';
import { items } from './items';
import { ServiceA } from './a.service';
import { ServiceB } from './b.service';

container.bind(items.ServiceA).to(ServiceA).inSingletonScope();
container.bind(items.ServiceB).to(ServiceB).inSingletonScope();

export const testA = container.get<ServiceA>(items.ServiceA);
export const testB = container.get<ServiceB>(items.ServiceB);
