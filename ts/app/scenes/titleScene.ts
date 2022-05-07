import * as IMAGE from "@root/const/IMAGE";
import * as GAME from "@root/const/GAME";
import { SceneBase } from "@root/app/sceneBase";
import { game } from "@root/app/core/game";
import { ObjBase } from "@root/app/objBase";
export class TitleScene extends SceneBase {
    init() {
        // 背景画像
        const bg_title: ObjBase = new ObjBase();
        bg_title.setImageInfo(IMAGE.BG_TITLE, GAME.CANVAS.SIZE);
        this.root.appendChild(bg_title);
        // イベント設定
        bg_title.on('click', () => {
            game.sceneMng.changeScene("game");
        });
    }
}