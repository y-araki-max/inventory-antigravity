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
    '他社商品',
    '本',
    'その他（ケース等）',
    'その他（丹青・NMN）',
    'カスタム'
];

// 商品リスト
// name: 画面表示用の略称
// fullName: 正式名称
export const PRODUCTS = [
    // --- マルチ ---
    { id: 'm1', category: 'マルチ', name: '大ボトル', fullName: 'マルチビタミン＆ミネラル大ボトル' },
    { id: 'm2', category: 'マルチ', name: '小ボトル', fullName: 'マルチビタミン＆ミネラル小ボトル' },
    { id: 'm3', category: 'マルチ', name: 'プレミアム', fullName: 'プレミアムビタミン＆ミネラル' },
    { id: 'm4', category: 'マルチ', name: 'アレケア', fullName: 'マルチビタミン＆ミネラル【アレルゲンケア】' },
    { id: 'm5', category: 'マルチ', name: 'アレケア18粒', fullName: 'マルチビタミン＆ミネラル【アレルゲンケア】 18粒入り' },
    { id: 'm6', category: 'マルチ', name: 'アスリート', fullName: 'マルチビタミン＆ミネラル【アスリート】' },
    { id: 'm7', category: 'マルチ', name: '女性用', fullName: 'マルチビタミン＆ミネラル女性用 Ver.2' },
    { id: 'm8', category: 'マルチ', name: 'インプラント', fullName: 'インプラントサポートVer.3' },
    { id: 'm9', category: 'マルチ', name: 'ウーマン', fullName: 'Woman selection 60包' },
    { id: 'm10', category: 'マルチ', name: 'PP', fullName: 'PROTECT PACK2020' },

    // --- ビタミン ---
    { id: 'v1', category: 'ビタミン', name: 'ビタミンA', fullName: 'ビタミンA' },
    { id: 'v2', category: 'ビタミン', name: 'VB群', fullName: 'ビタミンB群' },
    { id: 'v3', category: 'ビタミン', name: '葉酸', fullName: '葉酸＋VB6・VB12・VC' },
    { id: 'v4', category: 'ビタミン', name: 'VC-400', fullName: 'ビタミンC-400' },
    { id: 'v5', category: 'ビタミン', name: 'チュアブル', fullName: 'チュアブルVC' },
    { id: 'v6', category: 'ビタミン', name: 'リポC', fullName: 'リポソーム型ビタミンC（顆粒）' },
    { id: 'v7', category: 'ビタミン', name: 'アセロラ', fullName: 'アセロラVC' },
    { id: 'v8', category: 'ビタミン', name: 'ビタミンD', fullName: 'ビタミンD' },

    // --- ミネラル ---
    { id: 'mn1', category: 'ミネラル', name: 'カルマグ', fullName: 'カルシウム&マグネシウム' },
    { id: 'mn2', category: 'ミネラル', name: '亜鉛', fullName: 'グルコン酸亜鉛' },
    { id: 'mn3', category: 'ミネラル', name: 'セレン', fullName: 'セレン' },
    { id: 'mn4', category: 'ミネラル', name: 'ヘム鉄', fullName: 'ヘム鉄' },

    // --- オプショナル ---
    { id: 'o1', category: 'オプショナル', name: 'アンチ', fullName: 'アンチ-OXY' },
    { id: 'o2', category: 'オプショナル', name: 'プテロ', fullName: 'メチル化レスベラトロール（プテロスチルベン）' },
    { id: 'o3', category: 'オプショナル', name: 'NMN', fullName: 'NMN' },
    { id: 'o4', category: 'オプショナル', name: 'Q10', fullName: '「還元型」コエンザイムQ10' },
    { id: 'o5', category: 'オプショナル', name: 'リポ酸', fullName: 'α-リポ酸' },
    { id: 'o6', category: 'オプショナル', name: 'グアガム', fullName: 'グアガム' },
    { id: 'o7', category: 'オプショナル', name: 'シンバイオ', fullName: 'シンバイオティクス（CHOサポート）' },
    { id: 'o8', category: 'オプショナル', name: 'ビフィ', fullName: 'ビフィズス菌W【乳フリー】' },
    { id: 'o9', category: 'オプショナル', name: '有胞子', fullName: '有胞子乳酸菌' },
    { id: 'o10', category: 'オプショナル', name: 'サンプロ', fullName: 'サンプロテクトVer.2' },
    { id: 'o11', category: 'オプショナル', name: 'コラエラ', fullName: 'コラーゲン＆エラスチン サポート' },
    { id: 'o12', category: 'オプショナル', name: 'AG', fullName: 'AGハーブMIX' },
    { id: 'o13', category: 'オプショナル', name: 'NAG', fullName: 'N-アセチルグルコサミン プラス' },
    { id: 'o14', category: 'オプショナル', name: 'フォーカス', fullName: 'フォーカスサポート' },
    { id: 'o15', category: 'オプショナル', name: 'アミノ酸', fullName: 'アミノ酸（必須アミノ酸＋α）' },
    { id: 'o16', category: 'オプショナル', name: 'オメガ', fullName: 'オメガ3系脂肪酸 プラス' },
    { id: 'o17', category: 'オプショナル', name: 'メモリー', fullName: 'メモリー・ドライブ' },
    { id: 'o18', category: 'オプショナル', name: 'コリン', fullName: 'スマートコリンW（30包）' },
    { id: 'o19', category: 'オプショナル', name: '抹茶', fullName: '抹茶（100ｇ）' },

    // --- 他社商品 ---
    { id: 'ext1', category: '他社商品', name: 'エナジー', fullName: 'エナジーアシストQ10 PRO' },
    { id: 'ext2', category: '他社商品', name: 'エグノリジン', fullName: 'エグノリジンS' },

    // --- 本 ---
    { id: 'bk1', category: '本', name: '導入マニュアル', fullName: '【自由診療サプリメント導入実践マニュアル】' },
    { id: 'bk2', category: '本', name: 'サプリの正体', fullName: '【新版】サプリメントの正体' },
    { id: 'bk3', category: '本', name: 'アンチ最前線', fullName: '【アンチエイジング医療最前線】' },
    { id: 'bk4', category: '本', name: 'サプリ正体(文)', fullName: '【サプリメントの正体 文庫版】' },
    { id: 'bk5', category: '本', name: 'ビタミンの働き', fullName: '「ビタミンおよびビタミン様物質の働き」' },
    { id: 'bk6', category: '本', name: 'ミネラルの働き', fullName: '「ミネラルの働きと有害ミネラルの影響」' },
    { id: 'bk7', category: '本', name: '青本', fullName: '医療機関におけるサプリメント活用実践マニュアルver.2.0ロジック&しくみ編（青）' },
    { id: 'bk8', category: '本', name: 'オレンジ本', fullName: '医療機関におけるサプリメント活用実践マニュアルver.2.0心理&人間関係編（オレンジ）' },

    // --- その他（ケース等） ---
    { id: 'etc1', category: 'その他（ケース等）', name: 'ケース', fullName: 'サプリメントケース（青）' },
    { id: 'etc2', category: 'その他（ケース等）', name: '選びかた', fullName: '【ドクターに学ぶサプリメントの選びかた】' },
    { id: 'etc3', category: 'その他（ケース等）', name: '脳エイジング', fullName: '【マンガで学ぶ脳のエイジングケア】' },
    { id: 'etc4', category: 'その他（ケース等）', name: 'C-5ローション', fullName: 'C-5 モイストローション' },
    { id: 'etc5', category: 'その他（ケース等）', name: 'C-5ジェル', fullName: 'C-5 モイストジェル' },
    { id: 'etc6', category: 'その他（ケース等）', name: 'ヒアルロン酸', fullName: 'ヒアルロン酸' },

    // --- その他（丹青・NMN） ---
    { id: 'sp1', category: 'その他（丹青・NMN）', name: '丹青', fullName: '丹青' },
    { id: 'sp2', category: 'その他（丹青・NMN）', name: 'NMNケイ', fullName: 'NMNサプリメント（ケイメディスン）' },

    // --- カスタム ---
    { id: 'cst1', category: 'カスタム', name: '田中様', fullName: '田中 孝 様' },
    { id: 'cst2', category: 'カスタム', name: '村上様', fullName: '村上 様' }
];

