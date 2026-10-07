# ぶっちび — 独立iOS準備

公開Web `bd60537030d560147d7cfc882d63a4f70ce2c7d2` を固定した未公開構成。正式名「ぶっぱなせ！ちび軍団」、表示名「ぶっちび」、Bundle ID `io.github.ichinosepixel.bucchibi`。Apple登録はクラウド担当から確定連絡済みです。

公開Webやそのセーブは変更しません。ブラウザとアプリは保存領域が異なり、Webの購入・コイン・進行は自動では引き継げません。今回はアプリ専用の新規保存から開始します。Webからの明示的な書出し／読込み導線は未実装で、公開Webを変更する別の承認対象です。

## 用意したもの

- `baseline/`: 公開44ファイルそのまま。生成時にSHA256を照合します。
- `adapter/`: Capacitor Preferencesの専用キー `bucchibi.native.v1` にゲーム保存を一括保持。読取り完了前にはゲームを起動しません。保存完了後に購入・報酬を確定し、失敗時は直前の確定キャッシュに戻します。壊れた保存・将来の版を上書きしません。
- `scripts/build.mjs`: オフラインの3D・音声・JSを `www/` へ同梱。Three.jsとCapacitor JSもバンドルし、外部CDNやリモートserver URLは使いません。ゲーム性は変更しません。
- ライフサイクル: App状態／document visibilityを集約。中断は一時停止・保存・音声停止。復帰は時計と画面を再同期し、ユーザーの再開タップを待ちます。OSによる強制終了前の未完了書込みまで保証するものではありません。
- safe-area: 上下・左右のinset、HUD・通知・ボタンを調整。390/320幅と47/34pxの模擬insetを検証。
- `native/PrivacyInfo.xcprivacy`: PreferencesのUserDefaults使用理由CA92.1。広告・分析・追跡SDKは追加していません。
- `scripts/prepare-ios.mjs`: 承認後のMacで公式SPMテンプレートを生成・同期し、表示名・版・プライバシー宣言を設定するコマンド。コンパイル・署名・アップロードは実行しません。Team IDは空欄のままです。

## ローカル実行

Node 22以上で `npm ci --ignore-scripts`、`npm run build`、`npm test`。同梱内容を確認するには `node scripts/serve.mjs` で http://127.0.0.1:4260/ 。Windows環境のesbuildは親ディレクトリ読取りの制約で通常権限のローカル実行が必要でした。

Mac準備が承認された後だけ `npm run ios:prepare`。公式 `ios/` をWindowsで生成して設定検証済みですが、配布ブランチには生成物を含めずMacで再生成します。Swiftコンパイル・シミュレータ起動・署名・TestFlight送信の証拠はありません。新しいGitHubリポジトリは作成しません。既存リポジトリの独立iOSブランチを使います。

## 関連アプリから確認した知見

Frostの `native/STARTUP-INVESTIGATION.md`、`native/store.mjs`、`native/entry.mjs`、`docs/TESTFLIGHT-BUILD1-INVESTIGATION.md` と、hamudokuの `adapter/lifecycle.mjs`、各package/configを読取りのみ確認。`localmemory` / `memory_summary.md` という名前のファイルは、この2チェックアウトの限定探索では見つかりませんでした。GitHub上の同名メモも現在の接続では確認できていません。秘密・Team ID・証明書・他アプリのアイコンはコピーしていません。

Frostの初期WebView停止は原因未確定です。公式修正 #8595 は初回読込み前のscene通知転送を抑制しますが、Frostの停止原因を証明した修正ではありません。core/ios/cliは8.5.2、Appは8.1.2、Preferencesは8.0.1に固定し、公式テンプレートを用います。独自のSwift起動パッチ、待機ループ、リロード回避策は追加していません。

## 検証と残作業

保存再読込み・失敗巻戻し・将来形式保全・中断イベント重複・購入連打／保存失敗・報酬再試行のNode検証を実施。Chromeで全取得先がローカルであること、音声11点、出撃、保存再開、中断／復帰／音の再開、320/390px表示を確認。Preferencesは模擬実装、Appイベントはvisibilityの模擬入力です。これらはWKWebView実機の合格証拠ではありません。

登録情報と1.0(1)は確定済み。専用アイコンAは親確認済みで採用。アルファチャンネルのないRGB1024 PNGとAsset Catalogを同梱し、Mac準備時に自動設置します。起動画面はまず単色背景で、任意の起動ロゴは別途。テスト説明・問い合わせ先・プライバシー説明も配布前に確定します。

Mac側で必要: 公式プロジェクト生成、依存解決、無署名シミュレータ初回起動の画面確認、iPhoneでタッチ／safe-area／音声割込み／背景復帰／再起動保存／長時間メモリを確認。その後に署名・TestFlight送信を別途承認します。

参考: https://capacitorjs.com/docs/apis/preferences 、https://capacitorjs.com/docs/apis/app 、https://github.com/ionic-team/capacitor/pull/8595

採用アイコン: native/Assets.xcassets/AppIcon.appiconset。install-icon.mjsがRGB形式・寸法・承認済みSHA256を確認してから設置します。Apple登録・署名・ビルドは未実施です。

## 手動Codemagic実行の引継ぎ

既存breach-run-playtestの独立iOSブランチ用。mainとPagesには変更しません。1.0(1)、Team Q632QFMNAP、integration `Codemagic hamudoku`、certificate reference `hamudoku-distribution`、profile reference `bucchibi-app-store`。名前は秘密ではなく、証明書本体やAPIキーは同梱しません。

主workflow `ios-owner-testflight` は内部テスト専用IPAを作成してASCへアップロードします。外部Beta Review/App Store申請は行わず、本人を内部テスターへ割り当てる作業はクラウド担当が行います。起動前に無料枠残量を確認し、Codemagic環境へ `BUCCHIBI_REGISTRATION_CONFIRMED=1` と確定済み `APP_STORE_APPLE_ID` を設定してください。profile referenceの確定が必要です。初回build番号は1。既に1がアップロード済みなら番号を増やしてから起動します。

任意workflow `ios-simulator-smoke` はインストール済みiPhone Simulatorを1台だけ使用。1回の起動、10秒後の画像、終了まで。追加runtimeのダウンロードも繰返し起動も行いません。画像の内容合格は親が確認します。

今回、Windowsで公式iOSプロジェクト生成と設定処理の2回実行、ID/Team/1.0(1)/RGBアイコン/Privacyリソースの一致を確認しました。Swiftコンパイル・署名・Codemagic起動はまだ行っていません。

登録確定: App Store Connect App ID 6820066209 / SKU bucchibi-ios / 日本語。profile `bucchibi-app-store` 作成済み。workflowに確定済み登録確認とApp IDを反映。Codemagic側のprofile取得・既存repo許可と無料枠残量の確認後、クラウド担当が確定コミットを手動起動します。新APIキー不要。
