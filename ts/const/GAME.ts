// 画面設定
export namespace CANVAS {
    export namespace SIZE {
        export const W: number = 600;
        export const H: number = 480;
    }
}
// 描画順
export namespace DRAW_PRIORITY {
    export const MAX: number = 99999;
    export const MIN: number = 0;
    export const DEFAULT: number = 1000;
}
// フレームレート
export const FPS: number = 30;
// 画像描画サイズ型
export type ConstDrawSizeType = {
    W: number,
    H: number
}
// ゲーム
export const BLOCKSIZE = {
    W: 24,
    H: 24
}