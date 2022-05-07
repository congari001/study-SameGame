import { CoreBase } from "@root/app/coreBase";
import { Position, Size, Table } from "@root/lib/class";
import { game } from "@root/app/core/game";
export class ObjImage extends CoreBase {
    // 画像情報
    private _image: HTMLImageElement;
    private _chipPos: Position; // 画像切り出し基準位置
    private _chipSize: Size; // 画像切り出しサイズ
    private _chipTable: Table; // 切り出し画像番号
    private _drawSize: Size; // 賀状描画サイズ
    // 状態
    public active: boolean; // 描画する
    public priority: number; // 描画順
    constructor(path: string, priority: number=0, active: boolean=true) {
        super();
        this._image = game.imageBox.get(path);
        this._chipPos = new Position(0, 0);
        this._chipSize = new Size(this._image.width, this._image.height);
        this._chipTable = new Table(0, 0);
        this._drawSize = new Size(this._image.width, this._image.height);
        this.active = active;
        this.priority = priority;
    }
    get width(): number {
        return this._drawSize.width;
    }
    get height(): number {
        return this._drawSize.height;
    }
    /**
     * 画像切り分け設定
     */
    setChipInfo(chipX: number, chipY: number, chipW: number, chipH: number): void {
        this._chipPos.x = chipX;
        this._chipPos.y = chipY;
        this._chipSize.width = chipW;
        this._chipSize.height = chipH;
    }
    /**
     * 画像チップ選択（横）
     */
    setChipTableColumn(column: number): void {
        this._chipTable.column = column;
    }
    /**
     * 画像チップ選択（縦）
     */
    setChipTableRecord(record: number): void {
        this._chipTable.record = record;
    }
    /**
     * 画像描画設定
     */
    setDrawInfo(drawW: number, drawH: number) {
        this._drawSize.width = drawW;
        this._drawSize.height = drawH;
    }
    /**
     * 画像描画
     */
    draw(drawPos: Position): void {
        if (this.active) {
            if (this._image.complete) {
                game.canvasMng.getCanvas()?.getContext().drawImage(this._image
                    , this._chipPos.x + (this._chipSize.width * this._chipTable.column)
                    , this._chipPos.y + (this._chipSize.height * this._chipTable.record)
                    , this._chipSize.width , this._chipSize.height
                    , drawPos.x , drawPos.y
                    , this._drawSize.width , this._drawSize.height);
            } else {
                game.canvasMng.getCanvas()?.getContext().fillRect(drawPos.x , drawPos.y,this._drawSize.width , this._drawSize.height);
            }
        }
    }
}