import { promisify } from 'util';

/**
 * 等待特定时间
 * @param timeMs - 等待时间毫秒数
 */
export const sleep = async (timeMs: number) => {
    return promisify(setTimeout)(timeMs);
};
