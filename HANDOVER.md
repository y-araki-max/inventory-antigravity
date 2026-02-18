# プロジェクト最終引き継ぎ書 (Strict v12.3)

**重要**: 本ドキュメントは 2026年2月18日時点の最終決定版（v12.3）です。
`useInventory` フックからの状態公開漏れを修正し、プルダウン選択が確実にカレンダーへ反映されるようにしました。

## 1. 唯一の正解ルール (Single Source of Truth)

### リアクティブ・カレンダー (v12.3 Fixed)
- **状態管理**: `viewYear`, `viewMonth` は `useInventory` フック内で管理され、`InventoryTable` へ正しく提供されます。
- **更新フロー**:
    1. ユーザーがプルダウン変更 -> `setViewYear` / `setViewMonth` 呼び出し。
    2. `useInventory` 内の状態が更新 -> フックが再実行。
    3. `InventoryTable` が新しい `viewMonth` を受け取る。
    4. 「Strict v12.2」で実装した自動連動ロジックが走り、カレンダーが再描画される。

### UIルール
- **即時反映**: コンポーネント間の連携不全（TypeError等）が解消され、スムーズに月が切り替わります。

## 2. 運用ルール
- アプリケーションは常に「選択された年月」の正しい状態を表示します。

----
This document serves as the absolute reference for the project (v12.3).
