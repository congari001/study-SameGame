// オブジェクト生成用画像データタイプ
export type ConstImageType = {
    PATH: string,
    CHIP: {
        X: number,
        Y: number,
        W: number,
        H: number,
    }
}
// 透明板
export const ACRYLIC_BOARD = {
    PATH: "img/acrylic_board.png",
    CHIP: { X: 0, Y: 0, W: 32, H: 32}
}
// タイトル背景
export const BG_TITLE = {
    PATH: "img/title.png",
    CHIP: { X: 0, Y: 0, W: 1200, H: 960}
}
// ゲーム構成要素
export const SAMEGAME = {
    BLOCKLIST: [
        {
            PATH: "img/block1.png",
            CHIP: { X: 0, Y: 0, W: 32, H: 32}
        },
        {
            PATH: "img/block2.png",
            CHIP: { X: 0, Y: 0, W: 32, H: 32}
        },
        {
            PATH: "img/block3.png",
            CHIP: { X: 0, Y: 0, W: 32, H: 32}
        },
        {
            PATH: "img/block4.png",
            CHIP: { X: 0, Y: 0, W: 32, H: 32}
        },
        {
            PATH: "img/block5.png",
            CHIP: { X: 0, Y: 0, W: 32, H: 32}
        },
        {
            PATH: "img/block6.png",
            CHIP: { X: 0, Y: 0, W: 32, H: 32}
        },
    ],
    RESULT: {
        PATH: "img/otsukare.png",
        CHIP: { X: 0, Y: 0, W: 480, H: 160}
    }
} as const;