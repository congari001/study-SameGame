import { CoreBase } from "@root/app/coreBase";
import { ObjBase } from "@root/app/objBase";
import { Position } from "@root/lib/class";
import { Time } from "@root/lib/util";
import { game } from "@root/app/core/game";
export class GameController extends CoreBase {
    private _startPos: Position;
    private _selectedObjUniqueId: string;
    private _startTime: Time;
    private _status: number;
    constructor() {
        super();
        this._selectedObjUniqueId = "";
        this._startPos = new Position();
        this._startTime = new Time();
        this._status = 0;
    }
    get startPos(): Position {
        let pos: Position = new Position();
        pos.x = this._startPos.x;
        pos.y = this._startPos.y;
        return pos;
    }
    get elapse(): number {
        return this._startTime.elapse;
    }
    get isActive(): boolean {
        if (this._status === 0) {
            return true;
        }
        if (this._enabled_obj()) {
            return true;
        }
        return false;
    }
    /**
     * つかむ
     */
    select(obj: ObjBase): void {
        if (this._status === 0) {
            this._startTime.start();
            this._selectedObjUniqueId = obj.uniqueId;
            let pos: Position = obj.pos;
            this._startPos.x = pos.x;
            this._startPos.y = pos.y;
            this._status = 1;
        }
    }
    /**
     * 放す
     */
    release(): void  {
        if (this._status === 1) {
            this._startTime.stop();
            this._startPos.x = 0;
            this._startPos.y = 0;
            this._status = 0;
        }
    }
    /**
     * オブジェクト確認
     */
    private _enabled_obj(): boolean {
        let obj: ObjBase|null = game.objBox.get(this._selectedObjUniqueId);
        if (obj === null ) {
            return false;
        }
        return obj.isRemove;
    }
}