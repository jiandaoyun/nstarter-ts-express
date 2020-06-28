export class CommonUtils {
    public static getName() {
        return
    }

    public static async sleep (timeMs: number) {
        return new Promise((r) => setTimeout(r, timeMs));
    }
}
