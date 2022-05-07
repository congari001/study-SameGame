import { CoreBase } from "@root/app/coreBase";
export class ImageBox extends CoreBase {
    private _box: {[key: string]: HTMLImageElement};
    private _loadingImageList: Array<HTMLImageElement>;
    private _imageNum: number;
    constructor() {
        super();
        this._box = {};
        this._loadingImageList = [];
        this._imageNum = 0;
    }
    /**
     * 画像追加
     */
    add(path: string): void {
        if (!this._box.hasOwnProperty(path)) {
            let img: HTMLImageElement = new Image();
            img.src = path;
            this._box[path] = img;
            this._loadingImageList.push(this._box[path]);
            this._imageNum += 1;
        } else {
            //console.log("指定のパスの画像は登録済みです。path="+path);
        }
    }
    /**
     * 画像取得
     */
    get(path: string): HTMLImageElement {
        if (!this._box.hasOwnProperty(path)) {
            throw new Error("指定のパスの画像は登録されていません。path="+path);
        }
        return this._box[path];
    }
    /**
     * 画像の読み込み状況を更新する
     */
    _updLoadingImageList(): void {
        let len = this._loadingImageList.length;
        for (let i=0; i<len; i++) {
            if (this._loadingImageList[i].complete) {
                this._loadingImageList.splice(i, 1);
                i--;
                len--;
            }
        }
    }
    /**
     * 画像の読み込み状況を取得する
     */
    getLoadStatus(): any {
        this._updLoadingImageList();
        return {
            "isCompleted": ! this._loadingImageList.length,
            "imageNum": this._imageNum,
            "completeNum": this._imageNum - this._loadingImageList.length
        };
    }
}