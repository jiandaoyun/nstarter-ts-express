import { apmAgent } from 'nstarter-apm';

/**
 * IMPORTANT 此模块必须作为启动过程首先加载的模块，禁止增加额外模块依赖
 *
 * 环境变量
 * ELASTIC_APM_SERVER_URL - APM 服务器 URL
 */
export const apm = apmAgent.start({
    serviceName: 'ns-app',
    captureBody: 'transactions',
    captureHeaders: true,
    transactionMaxSpans: 100,
    // 未捕获异常处理会导致进程退出
    // @see https://github.com/elastic/apm-agent-nodejs/issues/1261
    captureExceptions: false,
    // 根据是否配置服务器连接控制是否启用 APM 监听
    active: !!process.env['ELASTIC_APM_SERVER_URL']
});
