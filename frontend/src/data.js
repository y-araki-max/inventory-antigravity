// Master Data v1.2
// スタッフリスト
export const STAFF_LIST = {
    PACKING: ['高塚', '鈴木', '山川'],
    CS: ['田邊', '松本', '狩野', '木原', '米田'],
    PLANNING: ['熊谷', '荒河']
};

// 商品カテゴリ
export const CATEGORIES = [
    "マルチ",
    "ビタミン",
    "ミネラル",
    "オプショナル①",
    "オプショナル②",
    "オプショナル③",
    "他社商品",
    "本",
    "その他",
    "その他2丹青",
    "カスタム"
];

// 商品リスト
// name: 画面表示用の略称
// fullName: 正式名称
export const PRODUCTS = [
    // --- マルチ ---
    { id: 101, category: "マルチ", name: "大ボトル", fullName: "マルチビタミン＆ミネラル 大ボトル" },
    { id: 102, category: "マルチ", name: "小ボトル", fullName: "マルチビタミン＆ミネラル 小ボトル" },
    { id: 103, category: "マルチ", name: "プレミアム", fullName: "プレミアムビタミン＆ミネラル" },
    { id: 104, category: "マルチ", name: "アレケア", fullName: "マルチビタミン＆ミネラル 【アレルゲンケア】" },
    { id: 105, category: "マルチ", name: "アレケア18粒", fullName: "マルチビタミン＆ミネラル 【アレルゲンケア】 18粒入り" },
    { id: 106, category: "マルチ", name: "アスリート", fullName: "マルチビタミン＆ミネラル 【アスリート】" },
    { id: 107, category: "マルチ", name: "女性用", fullName: "マルチビタミン＆ミネラル 女性用 Ver.2" },
    { id: 108, category: "マルチ", name: "インプラント", fullName: "インプラントサポート" },
    { id: 109, category: "マルチ", name: "ウーマン", fullName: "ベースサプリメント ウーマン" },
    { id: 110, category: "マルチ", name: "PP", fullName: "PP-2300" },

    // --- ビタミン ---
    { id: 201, category: "ビタミン", name: "ビタミンA", fullName: "ビタミンA" },
    { id: 202, category: "ビタミン", name: "VB群", fullName: "ビタミンB群" },
    { id: 203, category: "ビタミン", name: "葉酸", fullName: "葉酸" },
    { id: 204, category: "ビタミン", name: "VC-400", fullName: "ビタミンC-400" },
    { id: 205, category: "ビタミン", name: "チュアブル", fullName: "ビタミンC チュアブル" },
    { id: 206, category: "ビタミン", name: "リポC", fullName: "リポソームビタミンC" },
    { id: 207, category: "ビタミン", name: "アセロラ", fullName: "天然ビタミンC[アセロラ]" },
    { id: 208, category: "ビタミン", name: "ビタミンD", fullName: "ビタミンD" },

    // --- ミネラル ---
    { id: 301, category: "ミネラル", name: "カルマグ", fullName: "カルシウム＆マグネシウム" },
    { id: 302, category: "ミネラル", name: "亜鉛", fullName: "亜鉛" },
    { id: 303, category: "ミネラル", name: "セレン", fullName: "セレン" },
    { id: 304, category: "ミネラル", name: "ヘム鉄", fullName: "ヘム鉄" },

    // --- オプショナル① ---
    { id: 401, category: "オプショナル①", name: "アンチ", fullName: "アンチオキシダント" },
    { id: 402, category: "オプショナル①", name: "プテロ", fullName: "プテロスチルベン" },
    { id: 403, category: "オプショナル①", name: "NMN", fullName: "NMN" },
    { id: 404, category: "オプショナル①", name: "Q10", fullName: "コエンザイムQ10" },
    { id: 405, category: "オプショナル①", name: "リポ酸", fullName: "α-リポ酸" },

    // --- オプショナル② ---
    { id: 501, category: "オプショナル②", name: "グアガム", fullName: "サンファイバー（グアガム）" },
    { id: 502, category: "オプショナル②", name: "シンバイオ", fullName: "シンバイオティクス" },
    { id: 503, category: "オプショナル②", name: "ビフィ", fullName: "ビフィズス菌" },
    { id: 504, category: "オプショナル②", name: "有胞子", fullName: "有胞子性乳酸菌" },
    { id: 505, category: "オプショナル②", name: "サンプロ", fullName: "サンプロテクト" },
    { id: 506, category: "オプショナル②", name: "コラエラ", fullName: "コラーゲン＆エラスチン" },
    { id: 507, category: "オプショナル②", name: "AG", fullName: "AGハーブMIX" },

    // --- オプショナル③ ---
    { id: 601, category: "オプショナル③", name: "NAG", fullName: "N-アセチルグルコサミン" },
    { id: 602, category: "オプショナル③", name: "フォーカス", fullName: "フォーカスサポート" },
    { id: 603, category: "オプショナル③", name: "アミノ酸", fullName: "アミノ酸" },
    { id: 604, category: "オプショナル③", name: "オメガ", fullName: "オメガ３" },
    { id: 605, category: "オプショナル③", name: "メモリー", fullName: "メモリーサポート" },
    { id: 606, category: "オプショナル③", name: "コリン", fullName: "ホスファチジルコリン" },
    { id: 607, category: "オプショナル③", name: "抹茶", fullName: "抹茶" },

    // --- 他社商品 ---
    { id: 701, category: "他社商品", name: "エナジー", fullName: "エナジーアシストQ10" },
    { id: 702, category: "他社商品", name: "エグノリジン", fullName: "エグノリジン" },

    // --- 本 ---
    { id: 801, category: "本", name: "実践マニュアル", fullName: "実践マニュアル" },
    { id: 802, category: "本", name: "サプリメントの正体", fullName: "サプリメントの正体" },
    { id: 803, category: "本", name: "最前線", fullName: "医療機関サプリメントの最前線" },
    { id: 804, category: "本", name: "文庫版", fullName: "サプリメントの正体(文庫版)" },
    { id: 805, category: "本", name: "ビタミンポスター", fullName: "ビタミンポスター" },
    { id: 806, category: "本", name: "ミネラルポスター", fullName: "ミネラルポスター" },
    { id: 807, category: "本", name: "青本", fullName: "ドクターだけが知っている…(青)" },
    { id: 808, category: "本", name: "オレンジ本", fullName: "専門医が教える…(オレンジ)" },

    // --- その他 ---
    { id: 901, category: "その他", name: "ケース", fullName: "サプリメントケース" },
    { id: 902, category: "その他", name: "選びかた小冊子", fullName: "サプリメントの選び方(小冊子)" },
    { id: 903, category: "その他", name: "脳ケア小冊子", fullName: "脳ケア小冊子" },
    { id: 904, category: "その他", name: "C-5ローション", fullName: "C-5 ローション" },
    { id: 905, category: "その他", name: "C-5ジェル", fullName: "C-5 ジェル" },
    { id: 906, category: "その他", name: "ヒアルロン酸", fullName: "ヒアルロン酸" },

    // --- その他2丹青 ---
    { id: 950, category: "その他2丹青", name: "丹青", fullName: "丹青" },
    { id: 951, category: "その他2丹青", name: "NMN（ケイ）", fullName: "NMN（ケイ）" },

    // --- カスタム ---
    { id: 991, category: "カスタム", name: "田中 孝 様", fullName: "田中 孝 様" },
    { id: 992, category: "カスタム", name: "村上 様", fullName: "村上 様" }
];

