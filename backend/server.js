const express = require('express');
const cors = require('cors');
const fs = require('fs'); // ファイルを読み書きするための道具
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // 本番環境では指定されたポート、ローカルでは3000番を使います

// ミドルウェアの設定（お約束の設定）
app.use(cors()); // 別の場所（Reactなど）からのアクセスを許可する
app.use(express.json()); // 送られてきたJSONデータを扱えるようにする

// データ保存用ファイルの場所
const DATA_FILE = path.join(__dirname, 'data.json');

// --- フロントエンドの配信設定 (デプロイ用) ---
// ../frontend/dist フォルダの中身（HTML, CSS, JS）をそのまま公開する
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// --- API（窓口）の作成 ---

// 1. テスト用窓口
// ブラウザで http://localhost:3000/ にアクセスしたときに表示される
app.get('/', (req, res) => {
    res.send('在庫管理サーバーが動いています！');
});

// 2. 在庫一覧を取得する窓口 (GET /api/items)
app.get('/api/items', (req, res) => {
    // ファイルがない場合は空のリストを返す
    if (!fs.existsSync(DATA_FILE)) {
        return res.json([]);
    }

    // ファイルからデータを読み込んで返す
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('読み込みエラー:', err);
            return res.status(500).json({ error: 'データの読み込みに失敗しました' });
        }
        res.json(JSON.parse(data || '[]'));
    });
});

// 3. 在庫を追加する窓口 (POST /api/items)
app.post('/api/items', (req, res) => {
    const newItem = req.body; // 送られてきた新しいデータ

    // バリデーション（簡易チェック）
    if (!newItem.name || !newItem.quantity) {
        return res.status(400).json({ error: '商品名と数量は必須です' });
    }

    // 今のデータを読み込む
    let items = [];
    if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
        items = JSON.parse(fileContent || '[]');
    }

    // 新しいデータを追加
    items.push(newItem);

    // ファイルに保存
    fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), (err) => {
        if (err) {
            console.error('保存エラー:', err);
            return res.status(500).json({ error: 'データの保存に失敗しました' });
        }
        res.json({ message: '追加しました', item: newItem });
    });
});

// 4. その他のアクセスはすべてReactアプリ(index.html)を返す
// これがないと、ページ更新したときに「Not Found」になってしまいます
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// サーバーを起動
app.listen(PORT, () => {
    console.log(`Inventory Server v1.1.0 started`);
    console.log(`サーバーがポート ${PORT} で起動しました`);
    console.log(`確認用URL: http://localhost:${PORT}`);
});
