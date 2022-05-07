import { CoreBase } from "@root/app/coreBase";
import { Position } from "@root/lib/class";
import { game } from "@root/app/core/game";
export class GameCanvas extends CoreBase {
    private _canvas: HTMLCanvasElement;
    public isUpdate: boolean;
    constructor(width: number, height: number) {
        super();
        this._canvas = this._createCanvas(width, height);
        this.isUpdate = true;
    }
    // ゲームキャンバス作成
    _createCanvas(width: number, height: number): HTMLCanvasElement {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.border = "2px solid";
        // クリックイベント設定
        canvas.addEventListener('click', e => {
            // マウス座標をキャンバス内座標と合わせる
            const rect: DOMRect = canvas.getBoundingClientRect();
            const pos: Position = new Position(e.clientX - rect.left, e.clientY - rect.top);
            game.objBox.emit('click', {position: pos});
        });
        return canvas;
    }
    // キャンバスを追加
    appendChild(divId: string): void {
        let div: HTMLElement|null = document.getElementById(divId);
        if (div === null) {
            throw new Error("指定のIDのエレメントが見つかりませんでした。divId="+divId);
        }
        div.appendChild(this._canvas);
    }
    // コンテキストを取得
    getContext(): any {
        return this._canvas.getContext("2d");
    }
    // キャンバスをクリア
    clear(): void {
        let ctx: any = this.getContext();
        if (ctx) {
            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }
}