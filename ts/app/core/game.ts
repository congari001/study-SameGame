import * as GAME from "@root/const/GAME";
import { CoreBase } from "@root/app/coreBase";
import { ImageBox } from "@root/app/core/imageBox";
import { ObjBox } from "@root/app/core/objBox";
import { GameCanvasMng } from "@root/app/core/gameCanvasMng";
import { SceneMng } from "@root/app/sceneMng";
import { Time } from "@root/lib/util";
class Game extends CoreBase {
    private _fps: number;
    public time: Time;
    public imageBox: ImageBox;
    public objBox: ObjBox;
    public sceneMng: SceneMng;
    public canvasMng: GameCanvasMng;
    constructor() {
        super();
        this._fps = 0;
        this.time = new Time();
        this.imageBox = new ImageBox();
        this.objBox = new ObjBox();
        this.sceneMng = new SceneMng();
        this.canvasMng = new GameCanvasMng();
        console.log("create game.");
    }
    get fps(): number {
        return this._fps;
    }
    // _fps設定
    setFPS(_fps: number): void {
        this._fps = parseInt((1000/_fps).toString());
    }
    // 起動
    async Start(): Promise<void> {
        console.log("ゲーム起動");
        console.log("初期設定");
        this.setFPS(GAME.FPS);
        this.canvasMng.create("main", GAME.CANVAS.SIZE.W, GAME.CANVAS.SIZE.H);
        this.sceneMng.setFirstScene("title");

        // 画像読み込み
        console.log("ゲームループ開始");
        let roopCnt: number = 0; // ループ回数
        let updateCnt: number = 0; // 処理更新回数
        let elapse: number = 0; // 経過時間
        let delay: number = 0; // 処理遅延時間
        let loadingImage: any = null; // 画像読み込み状況
        this.time.start();
        while(true) {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    elapse = this.time.elapse;
                    if (elapse>=this._fps) {
                        this.time.stop();
                        this.time.restart();
                        delay = elapse - this._fps;
                        updateCnt = 0;
                        loadingImage = this.imageBox.getLoadStatus();
                        if (loadingImage["isCompleted"]) {
                            do {
                                updateCnt++;
                                delay = Math.max(delay-this._fps, 0);
                                this.sceneMng.update();
                            } while(delay>this._fps);
                        }
                        roopCnt++;
                        loadingImage = this.imageBox.getLoadStatus();
                        if (loadingImage["isCompleted"]) {
                            this.sceneMng.draw();
                        }
                    }
                    return resolve();
                });
            });
            //if (roopCnt>=1800) break;
        }
        console.log("ゲーム終了");
    }
}
export const game: Game = new Game();