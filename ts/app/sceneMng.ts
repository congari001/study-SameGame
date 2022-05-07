import { AppBase } from "@root/appBase";
import {SceneFactory, SceneNameMap} from "@root/app/sceneFactory";

export class SceneMng extends AppBase {
    private _nowScene: keyof SceneNameMap|null;
    private _nextScene: keyof SceneNameMap|null;
    private _instance: SceneNameMap[keyof SceneNameMap]|null;
    private _factory: SceneFactory;
    constructor() {
        super();
        this._nowScene = null;
        this._nextScene = null;
        this._instance = null;
        this._factory = new SceneFactory();
    }
    createScene<K extends keyof SceneNameMap>(key: K): SceneNameMap[K] {
        const scene: SceneNameMap[typeof key] = this._factory[key];
        return scene;
    }
    setFirstScene<K extends keyof SceneNameMap>(key: K): void {
        this._nextScene = key;
    }
    changeScene<K extends keyof SceneNameMap>(key: K): void {
        this._nextScene = key;
    }
    update(): void {
        if (this._nowScene != this._nextScene) {
            this._instance?.root.remove();
            if (this._nextScene) {
                const newScene: SceneNameMap[typeof this._nextScene] = this.createScene(this._nextScene);
                this._instance = newScene;
                this._nowScene = this._nextScene;
                this._instance.init();
            }
        }
        this._instance?.update();
    }
    draw(): void {
        if (this._instance) {
            this._instance.draw();
        }
    }
}