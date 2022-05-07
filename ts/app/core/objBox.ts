import { CoreBase } from "@root/app/coreBase";
import { ObjBase } from "@root/app/objBase";
import { game } from "@root/app/core/game";
export class ObjBox extends CoreBase {
    private _box: Array<ObjBase>;
    private _uidBox: {[key: string]: ObjBase};
    private _delBox: Array<ObjBase>;
    private _isSort: boolean; 
    constructor() {
        super();
        this._box = [];
        this._uidBox = {};
        this._delBox = [];
        this._isSort = true;
        // キャンバスのクリックイベントをオブジェクトに転送する
        this.on('click', (params: any) => {
            const clickX = params.detail.position.x;
            const clickY = params.detail.position.y;
            for (let i=this._box.length-1; 0<=i; i--) {
                const obj: ObjBase = this._box[i];
                if (!obj.isRemove && obj.image && obj.image.active) {
                    const left: number = obj.pos.x;
                    const top: number = obj.pos.y;
                    const right: number = left + obj.image.width;
                    const bottom: number = top + obj.image.height;
                    if (left <= clickX && clickX <= right) {
                        if (top <= clickY && clickY <= bottom) {
                            obj.emit('click', params);
                            console.log(`click to [y=${clickY}][x=${clickX}]`);
                            return;
                        }
                    }
                }
            }
        });
    }
    /**
     * オブジェクト追加
     */
    add(obj: ObjBase): boolean {
        if (this.isExists(obj.uniqueId)) {
            return false;
        }
        this._box.push(obj);
        this._uidBox[obj.uniqueId] = obj;
        this._isSort = true;
        return true;
    }
    /**
     * オブジェクト取得
     */
    get(uid: string): ObjBase|null {
        if (!this.isExists(uid)) {
            return null;
        }
        return this._uidBox[uid];
    }
    getByTag(tag: string): ObjBase[] {
        let result: ObjBase[] = [];
        let cnt = this._box.length;
        for (let i=0; i<cnt; i++) {
            if (this._box[i].hasTag(tag)) {
                result.push(this._box[i]);
            }
        }
        return result;
    }
    /**
     * オブジェクト削除
     */
    del(uid: string): boolean {
        if (!this._uidBox.hasOwnProperty(uid)) {
            return false;
        }
        delete this._uidBox[uid];
        let cnt = this._box.length;
        for (let i=0; i<cnt; i++) {
            if (this._box[i].uniqueId == uid) {
                let obj: ObjBase|undefined = this._box.splice(i, 1).shift();
                if (obj) {
                    this._delBox.push(obj);
                }
                break;
            }
        }
        return true;
    }
    /**
     * オブジェクト存在確認
     */
    isExists(uid: string): boolean {
        return this._uidBox.hasOwnProperty(uid) && !this._uidBox[uid].isRemove;
    }
    /**
     * オブジェクトの更新
     */
    update(): void {
        let objects: Array<ObjBase>=[];
        let len = this._box.length;
        for (let i=0; i<len; i++) {
            objects.push(this._box[i]);
            if (this._box[i].isNew) {
                this._box[i].init();
                this._box[i].initDone();
            }
        }
        for (let i=0; i<len; i++) {
            if (!objects[i].isRemove) {
                objects[i].moveToTarget();
                objects[i].update();
            }
        }
    }
    /**
     * 削除オブジェクトの後処理
     */
    final(): void {
        let len = this._delBox.length;
        for (let i=0; i<len; i++) {
            this._delBox[i].final();
            this._delBox.splice(i, 1);
            i--;
            len--;
        }
    }
    draw(): void {
        if (this._isSort) {
            this._box.sort((a: ObjBase, b: ObjBase) => {return a.drawPriority-b.drawPriority;});
            this._isSort = false;
        }
        game.canvasMng.clear();
        let len = this._box.length;
        for (let i=0; i<len; i++) {
            this._box[i].draw();
        }
    }
    count(): number {
        return this._box.length;
    }
}