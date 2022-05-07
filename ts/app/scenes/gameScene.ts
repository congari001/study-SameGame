import { SceneBase } from "@root/app/sceneBase";
import { SamegameMngObj } from "@root/app/obj/samegameMngObj";
import { game } from "@root/app/core/game";
import { ObjBase } from "@root/app/objBase";
import * as IMAGE from "@root/const/IMAGE";
import * as GAME from "@root/const/GAME";
import { Position } from "@root/lib/class";
export class GameScene extends SceneBase {
    private _samegame: SamegameMngObj;
    constructor() {
        super();
        this._samegame = new SamegameMngObj();
        this.root.appendChild(this._samegame);
    }
    get samegame(): SamegameMngObj {
        return this._samegame;
    }
    init() {
        const game_result: ObjBase = new ObjBase();
        game_result.setImageInfo(IMAGE.SAMEGAME.RESULT, IMAGE.SAMEGAME.RESULT.CHIP, 10000);
        game_result.setPos(new Position(GAME.CANVAS.SIZE.W/2 - IMAGE.SAMEGAME.RESULT.CHIP.W/2, GAME.CANVAS.SIZE.H/2 - IMAGE.SAMEGAME.RESULT.CHIP.H*0));
        game_result.on('click', () => {
            game.sceneMng.changeScene("title");
        });
        if (game_result.image) {
            game_result.image.active = false;
        }
        this.root.appendChild(game_result);
        this.root.on('gameOver', () => {
            setTimeout(() => {
                if (game_result.image) {
                    game_result.image.active = true;
                }
            }, 600);
        });
    }
}