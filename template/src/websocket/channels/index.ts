import { BaseChannel } from './channel.base';

import { messageChannel } from './channel.message';

export const channels: BaseChannel[] = [
    messageChannel
];
