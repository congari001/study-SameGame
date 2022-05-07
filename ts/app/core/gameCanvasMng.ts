import { CoreBase } from "@root/app/coreBase";
import { GameCanvas } from "@root/app/core/gameCanvas";
export class GameCanvasMng extends CoreBase {
    private _canvas: GameCanvas|null;
    constructor() {
        super();
        this._canvas = null;
    }
    /**
     * キャンバス作成
     * @param divId キャンバスを追加するdivのid 
     * @param width キャンバス幅
     * @param height キャンバス高さ
     */
    create(divId: string, width: number, height: number): void {
        this._canvas = new GameCanvas(width, height);
        this._canvas.appendChild(divId);
    }
    /**
     * キャンバス取得
     */
    getCanvas(): GameCanvas|null {
        return this._canvas;
    }
    /**
     * キャンバスをすべてクリア
     */
    clear(): void {
        this._canvas?.clear();
    }
}