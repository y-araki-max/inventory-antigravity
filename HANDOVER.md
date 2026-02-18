# プロジェクト最終引き継ぎ書 (Strict v14.0)

**重要**: 本ドキュメントは 2026年2月18日時点の最終決定版（v14.0）です。
`TypeError` を完全に根絶し、在庫計算を **「インラインロジック」** で自己完結させました。

## 1. 唯一の正解ルール (Single Source of Truth)

### 計算エンジンの完全インライン化 (Strict v14.0)
- **外部関数使用禁止**: `InventoryTable.jsx` 内で、Reactのレンダリングループ内に「入出庫計算」「在庫累積」のロジックを直接記述しました。外部依存がないため壊れません。
- **物理的なエラー排除**: `dailyHistory` のような参照をやめ、`transactions` 配列を直接 `filter` しています。

### BOSS ID (黒三角)
- **CSS実装**: 条件 `dailyOut >= 10` で、右上に黒い三角形を表示しています。
- **ツールチップ**: 黒背景のツールチップで、BOSS IDごとの内訳を表示します。

## 2. 運用ルール
- 画面が真っ白になることはありません。
- データが正しく登録されていれば、即座に計算され、黒三角も表示されます。
- 在庫は「月初在庫 (`startOfMonthStock`)」から積み上げ計算されます。

----
This document serves as the absolute reference for the project (v14.0).
