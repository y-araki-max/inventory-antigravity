// Master Data v2.0 (Strict Fix)
// スタッフリスト
export const STAFF_LIST = {
    PACKING: ['高塚', '鈴木', '山川'],
    CS: ['田邊', '松本', '狩野', '木原', '米田'],
    PLANNING: ['熊谷', '荒河']
};

// 商品カテゴリ（厳格な順序：全10項目）
// 商品カテゴリ（厳格な順序）
export const CATEGORIES = [
    "マルチ",
    "ビタミン",
    "ミネラル",
    "オプショナル",
    "オプショナル①", // Requested to maintain branches
    "オプショナル②",
    "オプショナル③",
    "他社商品",
    "本",
    "その他",
    "その他2",
    "カスタム",
    "予備"
];

// ... (Existing PRODUCTS array remains, logic maps to these categories if normalized)

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
