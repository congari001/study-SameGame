export class AppBase {
    private _base_events: any;
    constructor() {
        this._base_events = {};
    }
    // クラス名取得
    getClassName(): string {
        return this.constructor.name;
    }
    
    // イベントリスナー登録
    on(ev_name: string, func: (params: any) => void): void {
        if (typeof this._base_events[ev_name] === "undefined") {
            this._base_events[ev_name] = document.createElement("event");
        }
        this._base_events[ev_name].addEventListener(ev_name, func);
    }
    // イベント解除
    off(ev_name: string, func: (ev_name: string, func: any) => void): void {
        if (typeof this._base_events[ev_name] === "undefined") {
            return;
        }
        if (typeof func === "function") {
            this._base_events[ev_name].removeEventListener(ev_name, func);
        } else {
            delete this._base_events[ev_name];
        }
    }
    // イベント発行
    emit(ev_name: string, params: any) {
        if (typeof this._base_events[ev_name] !== "undefined") {
            this._base_events[ev_name].dispatchEvent(new CustomEvent(ev_name, {detail: params}));
        }
    }
}