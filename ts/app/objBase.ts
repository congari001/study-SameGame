import { AppBase } from "@root/appBase";
import { ObjImage } from "@root/app/core/objImage";
import { uniqueId } from "@root/lib/util";
import { Position } from "@root/lib/class";
import { game } from "@root/app/core/game";
import { ConstImageType } from "@root/const/IMAGE";
import { ConstDrawSizeType, DRAW_PRIORITY } from "@root/const/GAME";
export class ObjBase extends AppBase {
    private _image: ObjImage|null;
    private _uniqueId: string;
    private _pos: Position;
    private _targetPos: Position;
    private _moveFrameCnt: number;
    private _parentId: string;
    private _childrenId: Array<string>;
    private _tags: {[key: string]: boolean};
    private _isNew: boolean;
    private _isRemove: boolean;
    constructor() {
        super();
        this._image = null;
        this._uniqueId = uniqueId.create();
        this._pos = new Position();
        this._targetPos = new Position();
        this._moveFrameCnt = -1;
        this._parentId = "";
        this._childrenId = [];
        this._tags = {};
        this._isNew = true;
        this._isRemove = false;
    }
    get image() {
        return this._image;
    }
    setImageInfo(imageInfo: ConstImageType, drawSize: ConstDrawSizeType, priority: number=0, active: boolean=true): void {
        this.setImage(imageInfo.PATH, priority, active);
        if (this._image != null) {
            this._image.setChipInfo(imageInfo.CHIP.X, imageInfo.CHIP.Y, imageInfo.CHIP.W, imageInfo.CHIP.H);
            this._image.setDrawInfo(drawSize.W, drawSize.H);
        }
    }
    get uniqueId() {
        return this._uniqueId;
    }
    get parent():ObjBase|null {
        return game.objBox.get(this._parentId);
    }
    get children():Array<any> {
        let children:Array<ObjBase> = [];
        let cnt:number = this._childrenId.length;
        for (let i=0; i<cnt; i++) {
            let child: ObjBase|null = game.objBox.get(this._childrenId[i]);
            if (child != null) {
                children.push(child);
            }
        }
        return children;
    }
    get pos() {
        let x: number = this._pos.x;
        let y: number = this._pos.y;
        if (this.parent != null) {
            x += this.parent.pos.x;
            y += this.parent.pos.y;
        }
        return new Position(x, y);
    }
    get drawPriority(): number {
        if (this._image == null) {
            return 0;
        }
        return this._image.priority;
    }
    get isNew(): boolean {
        return this._isNew;
    }
    initDone(): void {
        this._isNew = false;
    }
    get isRemove(): boolean {
        return this._isRemove;
    }
    setPos(pos: Position) {
        this._moveFrameCnt = -1;
        this._targetPos.x = pos.x;
        this._targetPos.y = pos.y;
        this._pos.x += pos.x;
        this._pos.y += pos.y;
    }
    moveTo(targetPos: Position, frameCnt: number) {
        this._moveFrameCnt = frameCnt;
        this._targetPos.x = targetPos.x;
        this._targetPos.y = targetPos.y;
    }
    moveToTarget(): void {
        if (1<=this._moveFrameCnt) {
            this._pos.x += (this._targetPos.x - this._pos.x) / this._moveFrameCnt;
            this._pos.y += (this._targetPos.y - this._pos.y) / this._moveFrameCnt;
            this._moveFrameCnt--;
        }
        if (0==this._moveFrameCnt) {
            this._pos.x = this._targetPos.x;
            this._pos.y = this._targetPos.y;
            this._moveFrameCnt = -1;
        }
    }
    init(): void {}
    update(): void {}
    final(): void {}

    setImage(path: string, priority: number=DRAW_PRIORITY.DEFAULT, active: boolean=true) {
        if (priority < DRAW_PRIORITY.MIN) {
            throw new Error(`指定された描画優先順位が不正です。priority=${priority}, MIN=${DRAW_PRIORITY.MIN}`);
        }
        if (DRAW_PRIORITY.MAX < priority) {
            throw new Error(`指定された描画優先順位が不正です。priority=${priority}, MAX=${DRAW_PRIORITY.MAX}`);
        }
        game.imageBox.add(path);
        this._image = new ObjImage(path, priority, active);
    }
    draw(): void {
        if (this._image!=null) {
            this._image.draw(this.pos);
        }
    }
    _removeChildlenId(id: string): void {
        let cnt: number = this._childrenId.length;
        for (let i=0;i<cnt; i++) {
            if (this._childrenId[i] == id) {
                this._childrenId.splice(i, 1);
                return;
            }
        }
    }
    remove(root: boolean=true): void {
        let cnt: number = this._childrenId.length;
        if (root) {
            // 呼び出し元のみ、親の子リストから自身を削除
            if (this.parent != null) {
                this.parent._removeChildlenId(this.uniqueId);
            }
        }
        // 子を削除
        for (let i=0; i<cnt; i++) {
            let child = game.objBox.get(this._childrenId[i]);
            if (child != null) {
                child.remove(false);
            }
        }
        // 最後の処理
        this._isRemove = true;
        this.final();
        // boxから自身を削除
        game.objBox.del(this.uniqueId);
    }
    appendChild(obj: ObjBase): void {
        if (obj.parent != null) {
            obj.parent._removeChildlenId(obj.uniqueId);
        }
        obj._parentId = this._uniqueId;
        game.objBox.add(obj);
        this._childrenId.push(obj.uniqueId);
    }
    setTag(tag: string): void {
        this._tags[tag] = true;
    }
    delTag(tag: string): void {
        delete this._tags[tag];
    }
    hasTag(tag: string): boolean {
        return this._tags.hasOwnProperty(tag);
    }
    // イベントを親に伝播
    emit(ev_name: string, params: any): void {
        super.emit(ev_name, params);
        this.parent?.emit(ev_name, params);
    }
}