import { ObjBase } from "@root/app/objBase";
import { BlockObj } from "@root/app/obj/blockObj";
import { Size, Position } from "@root/lib/class";
import { BLOCKSIZE, CANVAS } from "@root/const/GAME";
export class SamegameMngObj extends ObjBase {
    private _board:(BlockObj|null)[][];
    private _blockColorNum: number;
    private _boardSize: Size;
    constructor() {
        super();
        this._blockColorNum = 4;
        this._boardSize = new Size(10, 8);
        this._board = [];
    }
    init() {
        this.createBoard();
        this.on('selectBlock',(params) => {
            this.selectBlock(params);
        });
        this.on('removeBlock', () => {
            this.removeBlock();
        });
    }
    boardMap(func: (x: number, y: number)=>void) {
        for (let y=0; y<this._board.length; y++) {
            for (let x=0; x<this._board[y].length; x++) {
                func(x, y);
            }
        }
    }
    boardCheck(func: (x: number, y: number)=>boolean) {
        for (let y=0; y<this._board.length; y++) {
            for (let x=0; x<this._board[y].length; x++) {
                if (func(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
    resetBoard(): void {
        // 残っているブロックオブジェクトを削除
        this.boardMap((x, y) => {
            this._board[y][x]?.remove();
        });
        // 設定中のサイズで空のゲームボードを作る
        this._board = [];
        for (let y=0; y<this._boardSize.height; y++) {
            this._board[y] = [];
            for (let x=0; x<this._boardSize.width; x++) {
                this._board[y][x] = null;
            }
        }
        // キャンバスの真ん中に移動させる
        const board_px_w: number = this._boardSize.width * (BLOCKSIZE.W+1);
        const board_px_h: number = this._boardSize.height * (BLOCKSIZE.H+1);
        this.setPos(new Position(CANVAS.SIZE.W/2 - board_px_w/2, CANVAS.SIZE.H/2 - board_px_h/2));
    }

    createBoard(): void {
        this.resetBoard();
        this.boardMap((x, y) => {
            const blockIdx: number = Math.round(Math.random() * 1000) % this._blockColorNum;
            const boardPos: Position = new Position(x, y);
            const block = new BlockObj(blockIdx, boardPos);
            this._board[y][x] = block;
            this.appendChild(block);
        });
    }
    selectBlock(param: any): void {
        const block: BlockObj = param.detail.block;
        // 選択中のブロックをリセット
        this.boardMap((x, y) => {
            this._board[y][x]?.viewNormal();
        });
        // ブロックを選択状態にする
        this.viewSelectAround(block);
    }
    viewSelectAround(block: BlockObj, result: number=0): number {
        // 自身を選択中にする
        if (block.isNormal) {
            block.viewSelect();
            result++;
        }
        // 隣の同色ブロックを選択状態にする
        let x: number = block.boardPos.x;
        let y: number = block.boardPos.y;
        const checkBlockPosList: Position[] = [
            new Position(x+1, y),
            new Position(x, y+1),
            new Position(x-1, y),
            new Position(x, y-1)
        ];
        for (let i=0; i<checkBlockPosList.length; i++) {
            const pos: Position = checkBlockPosList[i];
            if (typeof this._board[pos.y] === 'undefined' || typeof this._board[pos.y][pos.x] === 'undefined') {
                continue;
            }
            const checkBlock: BlockObj|null = this._board[pos.y][pos.x];
            if (checkBlock && checkBlock.idx === block.idx && checkBlock.isNormal) {
                checkBlock.viewSelect();
                result = this.viewSelectAround(checkBlock, result+1);
            }
        }
        // 隣り合った同色ブロックが無い場合は自身の選択状態を解除
        if (result<=1) {
            block.viewNormal();
        }
        return result;
    }
    removeBlock(): void {
        this.boardMap((x, y) => {
            const block: BlockObj|null = this._board[y][x];
            if (block && block.isSelect) {
                block.remove();
                this._board[y][x] = null;
            }
        });
        this.stuffBlock();
        if (this.isGameOver()) {
            this.emit('gameOver', {});
        }
    }
    stuffBlock() {
        const board_x: number = 0 < this._board.length ? this._board[0].length: 0;
        const board_y: number = this._board.length;
        // ブロックを下に落とす
        for (let x=0; x<board_x; x++) {
            for (let y=board_y-1; 0<y; y--) {
                const block: BlockObj|null = this._board[y][x];
                if (block === null) {
                    for (let targetY=y-1; 0<=targetY; targetY--) {
                        let targetBlock: BlockObj|null = this._board[targetY][x];
                        if (targetBlock) {
                            targetBlock.moveToBoardPosition(new Position(x, y));
                            this._board[y][x] = targetBlock;
                            this._board[targetY][x] = null;
                            break;
                        }
                    }
                }
            }
        }
        // 縦割れ列を左に詰める
        for (let x=0; x<board_x-1; x++) {
            const veaticalClack: boolean = this._board[board_y-1][x] === null;
            if (veaticalClack) {
                for (let targetX=x+1; targetX<board_x; targetX++) {
                    const block: BlockObj|null = this._board[board_y-1][targetX];
                    if (block) {
                        for (let y=0; y<board_y; y++) {
                            const targetBlock: BlockObj|null = this._board[y][targetX];
                            if (targetBlock) {
                                targetBlock.moveToBoardPosition(new Position(x, y));
                                this._board[y][x] = targetBlock;
                                this._board[y][targetX] = null;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    isGameOver(): boolean {
        return !this.boardCheck((x:number, y:number): boolean => {
            // 隣り合った同色ブロックがあるか
            const block: BlockObj|null = this._board[y][x];
            if (block) {
                const checkBlockPosList: Position[] = [
                    new Position(x+1, y),
                    new Position(x, y+1),
                    new Position(x-1, y),
                    new Position(x, y-1)
                ];
                for (let i=0; i<checkBlockPosList.length; i++) {
                    const pos: Position = checkBlockPosList[i];
                    if (!this._board[pos.y] || !this._board[pos.y][pos.x]) {
                        continue;
                    }
                    const aroundBlock: BlockObj|null = this._board[pos.y][pos.x];
                    if (aroundBlock) {
                        if (block.idx === aroundBlock.idx) {
                            return true;
                        }
                    }
                }
            }
            return false;
        });
    }
}