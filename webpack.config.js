const path = require('path');

module.exports = {
  // モードの設定
  mode: 'development',

  // エントリーポイントの設定
  entry: `./ts/index.ts`,

  // ファイルの出力設定
  output: {
    // 出力するファイル名
    filename: "bundle.js",

    //  出力先のパス
    path: path.join(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    alias: {
      '@root': path.resolve(__dirname, 'ts')
    },
    // 省略可能な拡張子
    extensions: ['.ts', '.js']
  }
};