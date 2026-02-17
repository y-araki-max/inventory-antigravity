// Master Data v2.0 (Strict Fix)
// スタッフリスト
export const STAFF_LIST = {
    PACKING: ['高塚', '鈴木', '山川'],
    CS: ['田邊', '松本', '狩野', '木原', '米田'],
    PLANNING: ['熊谷', '荒河']
};

// 商品カテゴリ（厳格な順序：v7）
export const CATEGORIES = [
    "マルチ",
    "ビタミン",
    "ミネラル",
    "オプショナル①", // アンチ, プテロ, NMN, Q10, リポ酸
    "オプショナル②", // グアガム, シンバイオ, ビフィ, 有胞子
    "オプショナル③", // サンプロ, コラエラ, AG, NAG
    "オプショナル④", // フォーカス, アミノ酸, オメガ, メモリー, コリン, 抹茶
    "他社商品",
    "本",
    "その他",
    "その他2",
    "カスタム"
];

// 商品リスト
// name: 画面表示用の略称
// fullName: 正式名称
export const PRODUCTS = [
    // --- マルチ ---
    { id: 101, category: "マルチ", name: "大ボトル", fullName: "マルチビタミン＆ミネラル 大ボトル", reorderPoint: 10 },
    { id: 102, category: "マルチ", name: "小ボトル", fullName: "マルチビタミン＆ミネラル 小ボトル", reorderPoint: 5 },
    { id: 103, category: "マルチ", name: "プレミアム", fullName: "プレミアムビタミン＆ミネラル", reorderPoint: 5 },
    { id: 104, category: "マルチ", name: "アレケア", fullName: "マルチビタミン＆ミネラル 【アレルゲンケア】", reorderPoint: 3 },
    { id: 105, category: "マルチ", name: "アレケア18粒", fullName: "マルチビタミン＆ミネラル 【アレルゲンケア】 18粒入り", reorderPoint: 3 },
    { id: 106, category: "マルチ", name: "アスリート", fullName: "マルチビタミン＆ミネラル 【アスリート】", reorderPoint: 3 },
    { id: 107, category: "マルチ", name: "女性用", fullName: "マルチビタミン＆ミネラル 女性用 Ver.2", reorderPoint: 3 },
    { id: 108, category: "マルチ", name: "インプラント", fullName: "インプラントサポート", reorderPoint: 3 },
    { id: 109, category: "マルチ", name: "ウーマン", fullName: "ベースサプリメント ウーマン", reorderPoint: 3 },
    { id: 110, category: "マルチ", name: "PP", fullName: "PP-2300", reorderPoint: 3 },

    // --- ビタミン ---
    { id: 201, category: "ビタミン", name: "ビタミンA", fullName: "ビタミンA", reorderPoint: 3 },
    { id: 202, category: "ビタミン", name: "VB群", fullName: "ビタミンB群", reorderPoint: 3 },
    { id: 203, category: "ビタミン", name: "葉酸", fullName: "葉酸", reorderPoint: 3 },
    { id: 204, category: "ビタミン", name: "VC-400", fullName: "ビタミンC-400", reorderPoint: 3 },
    { id: 205, category: "ビタミン", name: "チュアブル", fullName: "ビタミンC チュアブル", reorderPoint: 3 },
    { id: 206, category: "ビタミン", name: "リポC", fullName: "リポソームビタミンC", reorderPoint: 3 },
    { id: 207, category: "ビタミン", name: "アセロラ", fullName: "天然ビタミンC[アセロラ]", reorderPoint: 3 },
    { id: 208, category: "ビタミン", name: "ビタミンD", fullName: "ビタミンD", reorderPoint: 3 },

    // --- ミネラル ---
    { id: 301, category: "ミネラル", name: "カルマグ", fullName: "カルシウム＆マグネシウム", reorderPoint: 3 },
    { id: 302, category: "ミネラル", name: "亜鉛", fullName: "亜鉛", reorderPoint: 3 },
    { id: 303, category: "ミネラル", name: "セレン", fullName: "セレン", reorderPoint: 3 },
    { id: 304, category: "ミネラル", name: "ヘム鉄", fullName: "ヘム鉄", reorderPoint: 3 },

    // --- オプショナル① (アンチ, プテロ, NMN, Q10, リポ酸) ---
    { id: 401, category: "オプショナル①", name: "アンチ", fullName: "アンチオキシダント", reorderPoint: 3 },
    { id: 402, category: "オプショナル①", name: "プテロ", fullName: "プテロスチルベン", reorderPoint: 3 },
    { id: 403, category: "オプショナル①", name: "NMN", fullName: "NMN", reorderPoint: 3 },
    { id: 404, category: "オプショナル①", name: "Q10", fullName: "コエンザイムQ10", reorderPoint: 3 },
    { id: 405, category: "オプショナル①", name: "リポ酸", fullName: "α-リポ酸", reorderPoint: 3 },

    // --- オプショナル② (グアガム, シンバイオ, ビフィ, 有胞子) ---
    { id: 501, category: "オプショナル②", name: "グアガム", fullName: "サンファイバー（グアガム）", reorderPoint: 3 },
    { id: 502, category: "オプショナル②", name: "シンバイオ", fullName: "シンバイオティクス", reorderPoint: 3 },
    { id: 503, category: "オプショナル②", name: "ビフィ", fullName: "ビフィズス菌", reorderPoint: 3 },
    { id: 504, category: "オプショナル②", name: "有胞子", fullName: "有胞子性乳酸菌", reorderPoint: 3 },

    // --- オプショナル③ (サンプロ, コラエラ, AG, NAG) ---
    { id: 505, category: "オプショナル③", name: "サンプロ", fullName: "サンプロテクト", reorderPoint: 3 },
    { id: 506, category: "オプショナル③", name: "コラエラ", fullName: "コラーゲン＆エラスチン", reorderPoint: 3 },
    { id: 507, category: "オプショナル③", name: "AG", fullName: "AGハーブMIX", reorderPoint: 3 },
    { id: 601, category: "オプショナル③", name: "NAG", fullName: "N-アセチルグルコサミン", reorderPoint: 3 },

    // --- オプショナル④ (フォーカス, アミノ酸, オメガ, メモリー, コリン, 抹茶) ---
    { id: 602, category: "オプショナル④", name: "フォーカス", fullName: "フォーカスサポート", reorderPoint: 3 },
    { id: 603, category: "オプショナル④", name: "アミノ酸", fullName: "アミノ酸", reorderPoint: 3 },
    { id: 604, category: "オプショナル④", name: "オメガ", fullName: "オメガ３", reorderPoint: 3 },
    { id: 605, category: "オプショナル④", name: "メモリー", fullName: "メモリーサポート", reorderPoint: 3 },
    { id: 606, category: "オプショナル④", name: "コリン", fullName: "ホスファチジルコリン", reorderPoint: 3 },
    { id: 607, category: "オプショナル④", name: "抹茶", fullName: "抹茶", reorderPoint: 3 },

    // --- 他社商品 ---
    { id: 701, category: "他社商品", name: "エナジー", fullName: "エナジーアシストQ10", reorderPoint: 3 },
    { id: 702, category: "他社商品", name: "エグノリジン", fullName: "エグノリジン", reorderPoint: 3 },

    // --- 本 ---
    { id: 801, category: "本", name: "実践マニュアル", fullName: "実践マニュアル", reorderPoint: 0 },
    { id: 802, category: "本", name: "サプリメントの正体", fullName: "サプリメントの正体", reorderPoint: 0 },
    { id: 803, category: "本", name: "最前線", fullName: "医療機関サプリメントの最前線", reorderPoint: 0 },
    { id: 804, category: "本", name: "文庫版", fullName: "サプリメントの正体(文庫版)", reorderPoint: 0 },
    { id: 805, category: "本", name: "ビタミンポスター", fullName: "ビタミンポスター", reorderPoint: 0 },
    { id: 806, category: "本", name: "ミネラルポスター", fullName: "ミネラルポスター", reorderPoint: 0 },
    { id: 807, category: "本", name: "青本", fullName: "ドクターだけが知っている…(青)", reorderPoint: 0 },
    { id: 808, category: "本", name: "オレンジ本", fullName: "専門医が教える…(オレンジ)", reorderPoint: 0 },

    // --- その他 ---
    { id: 901, category: "その他", name: "ケース", fullName: "サプリメントケース", reorderPoint: 10 },
    { id: 902, category: "その他", name: "選びかた小冊子", fullName: "サプリメントの選び方(小冊子)", reorderPoint: 10 },
    { id: 903, category: "その他", name: "脳ケア小冊子", fullName: "脳ケア小冊子", reorderPoint: 10 },
    { id: 904, category: "その他", name: "C-5ローション", fullName: "C-5 ローション", reorderPoint: 3 },
    { id: 905, category: "その他", name: "C-5ジェル", fullName: "C-5 ジェル", reorderPoint: 3 },
    { id: 906, category: "その他", name: "ヒアルロン酸", fullName: "ヒアルロン酸", reorderPoint: 3 },

    // --- その他2 (丹青 etc) ---
    { id: 950, category: "その他2", name: "丹青", fullName: "丹青", reorderPoint: 3 },
    { id: 951, category: "その他2", name: "NMN（ケイ）", fullName: "NMN（ケイ）", reorderPoint: 3 },

    // --- カスタム ---
    { id: 991, category: "カスタム", name: "田中 孝 様", fullName: "田中 孝 様" },
    { id: 992, category: "カスタム", name: "村上 様", fullName: "村上 様" }
];

export const normalizeTerm = (term) => {
    if (!term) return '';
    const trimmedTerm = term.trim();
    const TERM_MAP = {
        '特別作戦': 'オプショナル',
        '特別作戦①': 'オプショナル①',
        '特別作戦②': 'オプショナル②',
        '特別作戦③': 'オプショナル③',
        'オプション①': 'オプショナル①',
        'オプション②': 'オプショナル②',
        'オプション③': 'オプショナル③',
        '競合商品': '他社商品',
        '質問10': 'Q10',
        'いん': 'アミノ酸',
        '有細胞子': '有胞子',
        'エネルギー': 'エナジー',
        '受け取り': '出庫入力',
        '受け取り入力': '出庫入力',
        '受取': '出庫入力',
        'ボス': 'BOSS'
    };
    return TERM_MAP[trimmedTerm] || trimmedTerm;
};
