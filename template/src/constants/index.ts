import * as SystemConsts from './system';
//#module rabbitmq
import * as QueueConsts from './queue';
//#endmodule rabbitmq

export const Consts = {
    System: SystemConsts,
    //#module rabbitmq
    Queue: QueueConsts
    //#endmodule rabbitmq
};

export {
    SystemConsts,
    //#module rabbitmq
    QueueConsts
    //#endmodule rabbitmq
};
