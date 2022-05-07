export const uniqueId: any = (() => {
    const max: number = 1000000;
    let id1: number = 0;
    let id2: number = 0;
    let id3: number = 0;
    // 0埋め桁揃え
    const digit: number = max.toString().length-1;
    const digitZero: string = Array(digit).join('0');
    const zeroPadding: any = (num: number): string => {
        let numStr: string = num.toString();
        return numStr.length > digit ? numStr: (digitZero + numStr).slice(-digit);
    }
    let latest: string = "";
    let getId: any = (id1: number, id2: number, id3: number): string => {
        return  "id-" + zeroPadding(id3) + "-" + zeroPadding(id2) + "-" + zeroPadding(id1);
    }
    // idオブジェクトを取得する
    return {
        "create": (): string => {
            latest = getId(id1, id2, id3);
            id1++;
            if (id1 >= max) {
                id1 = 0;
                id2 += 1;
            }
            if (id2 >= max) {
                id2 = 0;
                id3 += 1;
            }
            return latest;
        },
        "latest": (): string => {
            return latest;
        }
    };
})();
/**
 * 計測
 */
export class Time {
    private _startTime: number;
    private _endTime: number;
    constructor() {
        this._startTime = 0;
        this._endTime = 0;
    }
    /**
     * 計測開始時間を取得する
     */
    get now(): number {
        return performance.now(); //詳細なミリ秒数
    }
    /**
     * 計測開始から停止までの時間を取得する
     */
    get result(): number {
        return this._endTime - this._startTime;
    }
    /**
     * 計測開始から現在までの時間を取得する
     */
    get elapse(): number {
        return this.now - this._startTime;
    }
    /**
     * 計測開始する
     */
    start(): number {
        let now: number = this.now;
        this._startTime = now;
        this._endTime = now;
        return this._startTime;
    }
    /**
     * 計測を停止する
     */
    stop(): number {
        this._endTime = this.now;
        return this._endTime;
    }
    /**
     * 停止位置から再計測する
     */
    restart(): number {
        this._startTime = this._endTime;
        return this._startTime;
    }
}
