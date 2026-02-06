// スタッフリスト
export const STAFF_LIST = {
    PACKING: ['高塚', '鈴木', '山川'],
    CS: ['田邊', '松本', '狩野', '木原', '米田'],
    PLANNING: ['熊谷', '荒河']
};

// 商品カテゴリ
export const CATEGORIES = [
    'マルチ',
    'ビタミン',
    'ミネラル',
    'オプショナル',
    '他社商品'
];

// 商品リスト（一部抜粋してシンプルにします）
export const PRODUCTS = [
    // マルチ
    { id: 'm1', name: '大ボトル', category: 'マルチ' },
    { id: 'm2', name: '小ボトル', category: 'マルチ' },
    { id: 'm3', name: 'プレミアム', category: 'マルチ' },

    // ビタミン
    { id: 'v1', name: 'ビタミンA', category: 'ビタミン' },
    { id: 'v2', name: 'VB群', category: 'ビタミン' },
    { id: 'v4', name: 'VC-400', category: 'ビタミン' },

    // ミネラル
    { id: 'mn1', name: 'カルマグ', category: 'ミネラル' },
    { id: 'mn2', name: '亜鉛', category: 'ミネラル' },

    // オプショナル
    { id: 'o1', name: 'アンチ', category: 'オプショナル' },
    { id: 'o3', name: 'NMN', category: 'オプショナル' },
    { id: 'o4', name: 'Q10', category: 'オプショナル' },

    // 他社商品
    { id: 'other1', name: 'エナジー', category: '他社商品' },
];
