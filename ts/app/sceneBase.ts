import { AppBase } from "@root/appBase";
import { ObjBase } from "@root/app/objBase";
import { game } from "@root/app/core/game";
export class SceneBase extends AppBase {
    private _rootObj: ObjBase;
    constructor() {
        super();
        this._rootObj = new ObjBase();
        game.objBox.add(this._rootObj);
    }
    get root():ObjBase {
        return this._rootObj;
    }
    init() {}
    update() {
        game.objBox.update();
        game.objBox.final();
    }
    draw() {
        game.objBox.draw();
    }
}