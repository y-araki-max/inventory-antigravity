# プロジェクト最終引き継ぎ書 (Strict v8)

**重要**: 本ドキュメントは 2026年2月17日時点の最終決定版（v8）です。
旧文書（v7以前）はすべて無効です。

## 1. 唯一の正解ルール (Single Source of Truth)

### カテゴリ定義 (`data.js`)
- **オプショナル①〜④** への分割と **予備** の削除を厳守。
- 商品ID、名称、カテゴリのマッピングは `data.js` を正とする。

### マスタデータ
- **発注点 (`reorderPoint`)** と **平均出庫 (`avgDailyOut`)** を `data.js` に実装済み。
- 不明な値はハイフン (`-`) で登録されている。

### 翻訳干渉対策
- `index.html` に `lang="ja" class="notranslate" translate="no"` を常設すること。

## 2. システム機能・UI (Strict v8 Hybrid)

### 在庫表 (`InventoryTable.jsx`)
- **ハイブリッド表示**:
    - **基本**: 商品カード（グリッド）で一覧表示。
    - **詳細**: 商品名をクリックすると、直下に「日次カレンダー」を展開表示。
- **機能**:
    - **在庫修正**: 実在庫入力による差分自動計算。
    - **メモ**: `localStorage` に保存。
    - **ロット・発注点・平均出庫**: マスタデータを表示。

### データロジック (`useInventory.js`)
- **初期在庫**: CSV（1月末時点）
- **履歴計算**: 2月1日以降の `localStorage` ログ（IN/OUT/ADJUST）を積み上げ計算。
- **カレンダー**: 商品ごとの日次推移（入・出・サンプル・在庫）を動的に計算。

## 3. 運用ルール
- データの整合性を保つため、DB直接操作ではなくアプリUIを使用すること。

----
This document serves as the absolute reference for the project (v8).
