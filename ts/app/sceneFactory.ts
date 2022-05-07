import {TitleScene} from "@root/app/scenes/titleScene";
import {GameScene} from "@root/app/scenes/gameScene";

export class SceneFactory implements SceneNameMap {
    get title(): TitleScene {
        return new TitleScene();
    }
    get game(): GameScene {
        return new GameScene();
    }
}
// シーンリスト
export interface SceneNameMap {
    "title": TitleScene,
    "game": GameScene,
}