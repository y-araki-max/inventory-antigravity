# プロジェクト最終引き継ぎ書 (Strict v10.2 Hotfix)

**重要**: 本ドキュメントは 2026年2月17日時点の最終決定版（v10.2 Hotfix）です。
`ReferenceError` を修正し、在庫表の表示ロジックを確立しました。

## 1. 唯一の正解ルール (Single Source of Truth)
- **マスタデータ駆動表示**: 在庫表（`InventoryTable`）は、**常に `data.js` の `PRODUCTS` 定義に基づいて描画**されます。
- **インポート修正**: `InventoryTable.jsx` にて `PRODUCTS` が正しくインポートされていることを保証。

## 2. システム機能・UI (Strict v10.2)
- **月別アーカイブ**: 完全同期（v10.1仕様維持）。
- **データ管理**: 強制初期化・キャッシュ対策（v10.1仕様維持）。
- **UI堅牢性**: データ未ロード時も表枠組みは必ず表示される（v10.2仕様）。

## 3. 運用ルール
- 画面が真っ白などのエラーが出た場合は、コンソールを確認し、変数が正しくインポートされているか確認してください。

----
This document serves as the absolute reference for the project (v10.2 Hotfix).
