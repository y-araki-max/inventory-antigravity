import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { STAFF_LIST, CATEGORIES, PRODUCTS } from '../data';
import { BigButton } from '../components/BigButton';
import { NumPad } from '../components/NumPad';
import { CameraInput } from '../components/CameraInput';
import { Trash2, Send, ShoppingCart, Plus, Minus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { storage } from '../utils/storage';

export default function Outbound() {
    // 入力データ
    const [bossId, setBossId] = useState('');
    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [cart, setCart] = useState([]); // 送信待ちの商品リスト
    const [imageData, setImageData] = useState(null); // カメラ画像(Base64)
    const [isCartOpen, setIsCartOpen] = useState(false); // カートドロワーの開閉

    // ヘッダーの折りたたみ状態
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

    // 特殊チェックボックス
    const [isStaffSale, setIsStaffSale] = useState(false);

    const [isBossCheck, setIsBossCheck] = useState(false);
    const [isSample, setIsSample] = useState(false);

    // モーダル用
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    // 日付
    const today = new Date().toLocaleDateString('ja-JP');

    // 商品がクリックされたとき
    const handleProductClick = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    // --- ローカルストレージ：ドラフト保存機能 ---
    // 初回マウント時に復元
    useEffect(() => {
        const savedDraft = localStorage.getItem('draft_outbound');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                if (draft.bossId) setBossId(draft.bossId);
                if (draft.selectedStaff) setSelectedStaff(draft.selectedStaff);
                if (draft.cart) setCart(draft.cart);
                if (draft.isStaffSale !== undefined) setIsStaffSale(draft.isStaffSale);
                if (draft.isBossCheck !== undefined) setIsBossCheck(draft.isBossCheck);
                if (draft.isSample !== undefined) setIsSample(draft.isSample);
            } catch (e) {
                console.error('Draft restore failed', e);
            }
        }
    }, []);

    // ステート変更時に保存
    useEffect(() => {
        const draft = {
            bossId,
            selectedStaff,
            cart,
            isStaffSale,
            isBossCheck,
            isSample
        };
        localStorage.setItem('draft_outbound', JSON.stringify(draft));
    }, [bossId, selectedStaff, cart, isStaffSale, isBossCheck, isSample]);
    // -------------------------------------------

    // 数量が確定されたとき
    const handleQuantityConfirm = (qty) => {
        if (qty > 0 && currentProduct) {
            // カートに追加
            setCart(prev => {
                // 既に同じ商品があれば数量を加算するのではなく、別明細として追加するか、統合するか。
                // リクエストでは「送信リストのUI改善」なので、既存ロジック（追加）を維持しつつ、
                // リスト内で編集できるようにする。
                return [...prev, {
                    ...currentProduct,
                    quantity: qty,
                    uuid: crypto.randomUUID() // 一意なIDを付与して管理しやすくする
                }];
            });
            setIsCartOpen(true); // カートを自動で開く

            // BOSS番号と担当者が入力されていればヘッダーを折りたたむ
            // This logic is now handled proactively by checkAndCollapseHeader
            // if (bossId && selectedStaff && !isHeaderCollapsed) {
            //     setIsHeaderCollapsed(true);
            // }
        }
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    // カート内の数量変更
    const updateCartItemQuantity = (uuid, delta) => {
        setCart(prev => prev.map(item => {
            if (item.uuid === uuid) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    // カートから個別削除
    const removeCartItem = (uuid) => {
        setCart(prev => prev.filter(item => item.uuid !== uuid));
        if (cart.length <= 1) setIsCartOpen(false);
    };

    // 全削除
    const clearCart = () => {
        if (window.confirm('本当に全て削除しますか？')) {
            localStorage.removeItem('draft_outbound');
            setCart([]);
            setIsCartOpen(false);
        }
    };

    // チェックボックスの変更ハンドラ
    const handleCheckChange = (type, checked) => {
        if (checked) {
            if (!window.confirm(`${type === 'staff' ? '社販' : type === 'sample' ? 'サンプル品' : 'BOSSチェック'}として処理しますか？`)) {
                return; // キャンセルなら何もしない
            }
        }
        if (type === 'staff') setIsStaffSale(checked);

        if (type === 'boss') setIsBossCheck(checked);
        if (type === 'sample') setIsSample(checked);
    };

    // ヘッダーの自動折りたたみロジック
    const checkAndCollapseHeader = (newBossId, newStaff) => {
        const id = newBossId !== undefined ? newBossId : bossId;
        const staff = newStaff !== undefined ? newStaff : selectedStaff;
        if (id && staff) {
            setIsHeaderCollapsed(true);
        }
    };

    // 送信処理
    const handleSubmit = async () => {
        if (!bossId) return alert('BOSSを入力してください');
        if (!selectedStaff) return alert('担当者を選んでください');
        if (cart.length === 0) return alert('商品を選んでください');

        if (!window.confirm('送信しますか？')) return;

        try {
            // カート内の商品を1つずつ送信
            const timestamp = new Date().toISOString();

            for (const item of cart) {
                const data = {
                    uuid: item.uuid || crypto.randomUUID(), // IDがあれば使う
                    date: timestamp,
                    type: 'OUT',
                    bossId,
                    staff: selectedStaff,
                    name: item.name,
                    fullName: item.fullName, // 正式名称も保存
                    productId: item.id,
                    category: item.category,
                    quantity: item.quantity,
                    isStaffSale,
                    isBossCheck,

                    isSample,
                    imageData // 画像データ(Base64) ※容量注意
                };

                // API送信
                await axios.post('/api/items', data);

                // localStorageに保存
                storage.saveItem(data);
            }

            alert('送信しました！');
            // クリア
            localStorage.removeItem('draft_outbound'); // ドラフト削除
            setCart([]);
            setImageData(null);
            setBossId('');
            setSelectedStaff('');
            setIsStaffSale(false);

            setIsBossCheck(false);
            setIsSample(false);
            setIsCartOpen(false);
            setIsHeaderCollapsed(false); // 入力が終わったらヘッダーを展開して次の入力に備える

        } catch (error) {
            console.error(error);
            alert('送信に失敗しました');
        }
    };

    // カテゴリで商品を絞り込み
    const filteredProducts = PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            {/* ヘッダーエリア */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-30 transition-all duration-300">

                {/* 折りたたみ時の簡易表示 */}
                {isHeaderCollapsed ? (
                    <div
                        className="flex justify-between items-center bg-blue-50 p-2 rounded-lg cursor-pointer"
                        onClick={() => setIsHeaderCollapsed(false)}
                    >
                        <div className="flex flex-col">
                            <div className="text-xs text-blue-600 font-bold">{today}</div>
                            <div className="font-bold text-gray-800">
                                ID: {bossId || '未入力'} / 担当者: {selectedStaff || '未選択'}
                            </div>
                        </div>
                        <ChevronDown className="text-blue-500" />
                    </div>
                ) : (
                    /* 展開時のフル入力フォーム */
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="text-gray-500 font-bold whitespace-nowrap">{today}</div>
                                <div className="flex-1 flex items-center gap-2">
                                    <label className="text-xs text-gray-400 font-bold whitespace-nowrap">BOSS</label>
                                    <input
                                        key="boss-id-input"
                                        type="text"
                                        value={bossId}
                                        onChange={(e) => setBossId(e.target.value)}
                                        onBlur={() => checkAndCollapseHeader(undefined, undefined)}
                                        className="w-full text-xl font-bold border-b-2 border-gray-300 outline-none p-1"
                                        placeholder="番号"
                                    />
                                </div>
                            </div>
                            {/* 手動折りたたみボタン */}
                            {(bossId || selectedStaff) && (
                                <button onClick={() => setIsHeaderCollapsed(true)} className="text-gray-400 p-1">
                                    <ChevronUp />
                                </button>
                            )}
                        </div>

                        {/* スタッフ選択 (2列配置のコンテナ) */}
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            {/* 梱包スタッフ */}
                            <div>
                                <div className="text-xs text-gray-400 font-bold mb-1">梱包スタッフ</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {STAFF_LIST.PACKING.map(name => (
                                        <button
                                            key={name}
                                            onClick={() => {
                                                setSelectedStaff(name);
                                                checkAndCollapseHeader(undefined, name);
                                            }}
                                            className={`px-1 py-2 rounded-lg font-bold text-xs border truncate
                            ${selectedStaff === name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}
                          `}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CS部 */}
                            <div>
                                <div className="text-xs text-gray-400 font-bold mb-1">CS部</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {STAFF_LIST.CS.map(name => (
                                        <button
                                            key={name}
                                            onClick={() => {
                                                setSelectedStaff(name);
                                                checkAndCollapseHeader(undefined, name);
                                            }}
                                            className={`px-1 py-2 rounded-lg font-bold text-xs border truncate
                            ${selectedStaff === name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}
                          `}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* カテゴリタブ */}
            <div className={`flex overflow-x-auto gap-2 p-2 bg-gray-100 sticky z-20 shadow-inner transition-all ${isHeaderCollapsed ? 'top-[70px]' : 'top-[210px]'}`}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap shadow-sm transition-all
              ${selectedCategory === cat ? 'bg-blue-600 text-white scale-105' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
            `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* 商品一覧 */}
            <div className="p-4 grid grid-cols-2 gap-3">
                {filteredProducts.map(product => (
                    <BigButton
                        key={product.id}
                        variant="secondary"
                        className="h-20 text-lg leading-tight break-words"
                        onClick={() => handleProductClick(product)}
                    >
                        {product.name}
                    </BigButton>
                ))}
            </div>

            {/* カートフローティングボタン (閉じているとき) */}
            {!isCartOpen && cart.length > 0 && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-24 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg z-40 animate-bounce flex items-center gap-2"
                >
                    <ShoppingCart size={24} />
                    <span className="font-bold text-lg">{cart.length}</span>
                </button>
            )}

            {/* カートドロワー (スライドアップ) */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}>
                    <div
                        className="bg-white w-full max-w-md rounded-t-2xl shadow-2xl flex flex-col max-h-[90vh]"
                        onClick={e => e.stopPropagation()} // ドロワー内部クリックで閉じないように
                    >
                        {/* ドロワーヘッダー */}
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-700">
                                <ShoppingCart size={20} />
                                送信リスト
                                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
                            </h3>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* カートリスト (スクロール領域) */}
                        <div className="overflow-y-auto p-4 space-y-3 flex-1">
                            {cart.length === 0 ? (
                                <p className="text-center text-gray-400 py-8">リストは空です</p>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.uuid} className="bg-white border-2 border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-2 relative">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-lg text-gray-800">{item.name}</div>
                                                <div className="text-xs text-gray-400">{item.fullName}</div>
                                            </div>
                                            <button
                                                onClick={() => removeCartItem(item.uuid)}
                                                className="text-gray-400 hover:text-red-500 p-1"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mt-1">
                                            <span className="text-xs font-bold text-gray-500">数量</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateCartItemQuantity(item.uuid, -1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white border rounded-full shadow-sm active:bg-gray-100"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="text-xl font-bold text-blue-800 w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateCartItemQuantity(item.uuid, 1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white border rounded-full shadow-sm active:bg-gray-100"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* ドロワーフッター (アクション) - ここにカメラとチェックボックスを移動 */}
                        <div className="p-4 border-t bg-gray-50 safe-area-bottom space-y-4">

                            {/* 特殊チェック & カメラ (ドロワー内に移動) */}
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 flex gap-3 items-center bg-white border p-2 rounded-lg shadow-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isStaffSale}
                                            onChange={(e) => handleCheckChange('staff', e.target.checked)}
                                            className="w-5 h-5 accent-blue-600"
                                        />
                                        <span className="font-bold text-xs whitespace-nowrap">社販</span>
                                    </label>
                                    <div className="h-4 w-[1px] bg-gray-300"></div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isBossCheck}
                                            onChange={(e) => handleCheckChange('boss', e.target.checked)}
                                            className="w-5 h-5 accent-orange-500"
                                        />
                                        <span className="font-bold text-xs whitespace-nowrap">BOSS</span>
                                    </label>
                                    <div className="h-4 w-[1px] bg-gray-300"></div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isSample}
                                            onChange={(e) => handleCheckChange('sample', e.target.checked)}
                                            className="w-5 h-5 accent-gray-500"
                                        />
                                        <span className="font-bold text-xs whitespace-nowrap">サンプル</span>
                                    </label>
                                </div>

                                <div className="w-1/3">
                                    <CameraInput onImageCapture={setImageData} label="撮影" />
                                </div>
                            </div>

                            <BigButton onClick={handleSubmit} variant="primary" className="py-4 text-xl w-full shadow-lg">
                                <Send className="inline mr-2" />
                                まとめて送信
                            </BigButton>

                            <button
                                onClick={clearCart}
                                className="w-full text-red-400 text-sm font-bold py-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                全て削除
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 数量入力モーダル */}
            <NumPad
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleQuantityConfirm}
                title={currentProduct?.name}
            />
        </div>
    );
}

