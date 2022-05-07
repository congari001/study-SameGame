import { ObjBase } from "@root/app/objBase";
import { SAMEGAME } from "@root/const/IMAGE";
import { BLOCKSIZE } from "@root/const/GAME";
import { Position } from "@root/lib/class";
export class BlockObj extends ObjBase {
    private _blockIdx: number;
    private _viewType: number;
    private _boardPos: Position;
    constructor(blockIdx: number, boardPos: Position) {
        super();
        this._blockIdx = blockIdx;
        this._viewType = 0;
        this._boardPos = new Position();
        this.setImageInfo(SAMEGAME.BLOCKLIST[blockIdx], BLOCKSIZE);
        this.image?.setChipTableColumn(this._viewType);
        this.setBoardPosition(boardPos);
        // イベント登録
        this.on('click', (params) => {
            switch (true) {
                case this.isNormal: {
                    this.emit('selectBlock', {block: this});
                    break;
                }
                case this.isSelect: {
                    this.emit('removeBlock', {block: this});
                    break;
                }
            }
        });
    }
    get idx(): number {
        return this._blockIdx;
    }
    get viewType(): number {
        return this._viewType;
    }
    get boardPos(): Position {
        return this._boardPos;
    }

    get isNormal(): boolean {
        return this._viewType === 0;
    }

    viewNormal(): void {
        this._viewType = 0;
        this.image?.setChipTableColumn(this._viewType);
    }

    get isSelect(): boolean {
        return this._viewType === 1;
    }
    viewSelect(): void {
        this._viewType = 1;
        this.image?.setChipTableColumn(this._viewType);
    }
    convBoardPos2DrawPos(boardPos: Position): Position {
        return new Position(boardPos.x*(BLOCKSIZE.W+1), boardPos.y*(BLOCKSIZE.H+1));
    }
    setBoardPosition(boardPos: Position): void {
        this._boardPos.x = boardPos.x;
        this._boardPos.y = boardPos.y;
        this.setPos(this.convBoardPos2DrawPos(this._boardPos));
    }
    moveToBoardPosition(boardPos: Position): void {
        this._boardPos.x = boardPos.x;
        this._boardPos.y = boardPos.y;
        this.moveTo(this.convBoardPos2DrawPos(this._boardPos), 5);
    }
}