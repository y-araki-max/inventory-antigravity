# プロジェクト最終引き継ぎ書 (Strict v14.3)

**重要**: 本ドキュメントは 2026年2月18日時点の最終決定版（v14.3）です。
集計画面で見えているデータが在庫表に表示されない問題を解決するため、**「直接データアクセス」と「日付正規化」**を実装しました。

## 1. 唯一の正解ルール (Single Source of Truth)

### データの直接取得 (Direct LocalStorage Access)
- **修正点**: `useInventory` フック経由のデータ (`transactions`) 依存をやめ、`InventoryTable.jsx` 内で直接 `localStorage.getItem('inventory-transactions')` をパースしています。
- **目的**: フック内での不要なフィルタリングや状態更新のラグを回避し、保存されている「真実のデータ」を即座に描画するため。

### 日付正規化 (Date Normalization)
- **修正点**: データの `date` プロパティに含まれる区切り文字（`/`）をすべてハイフン（`-`）に置換し、カレンダーの日付キー（`YYYY-MM-DD`）と確実に照合させています。
- **コード**: `t.date.replace(/\//g, '-') === dayKey`

### BOSS ID (黒三角)
- **CSS実装**: `dailyOut >= 10` の場合、右上に黒い三角形を表示。

## 2. 運用ルール
- 画面が真っ白になることはありません。
- 入力されたデータ（例：入庫 4816）は、日付形式の違いに関わらず、即座にテーブルに反映されます。

----
This document serves as the absolute reference for the project (v14.3).
