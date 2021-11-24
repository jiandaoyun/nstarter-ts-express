import { promisify } from 'util';

export class CommonUtils {
    public static getName() {
        return;
    }

    public static async sleep (timeMs: number) {
        return promisify(setTimeout)(timeMs);
    }
}
