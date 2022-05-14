# fly-js

紙飛行機ゲーム風ブラウザゲーム

## セットアップ

1. gitリポジトリをDLする
2. npmで必要パッケージをインストール

    ```:sh
    npm install
    ```

3. ファイルをコンパイル

    ```:sh
    npm run build-release
    ```

## 動作確認方法

1. コンソールを起動
2. カレントディレクトリを./distに移動
3. npmのhttp-serverなどを実行(事前にDLしておく)
4. サーバーにブラウザでアクセスするとゲームが実行される

## ビルド時にパッケージされるサードパーティソフトウェア

|名称|ライセンス|
|-|-|
|[vue](https://github.com/vuejs/core)|MIT License|
|[phaser](https://github.com/photonstorm/phaser)|MIT license|
