import React, { useState } from 'react';
import axios from 'axios';
import { STAFF_LIST, CATEGORIES, PRODUCTS } from '../data';
import { BigButton } from '../components/BigButton';
import { NumPad } from '../components/NumPad';
import { CameraInput } from '../components/CameraInput';
import { Trash2, Send, ShoppingCart } from 'lucide-react';

export default function Outbound() {
    // 入力データ
    const [bossId, setBossId] = useState('');
    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [cart, setCart] = useState([]); // 送信待ちの商品リスト
    const [imageData, setImageData] = useState(null); // カメラ画像(Base64)

    // 特殊チェックボックス
    const [isStaffSale, setIsStaffSale] = useState(false);
    const [isBossCheck, setIsBossCheck] = useState(false);

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

    // 数量が確定されたとき
    const handleQuantityConfirm = (qty) => {
        if (qty > 0 && currentProduct) {
            // カートに追加
            setCart(prev => [...prev, {
                ...currentProduct,
                quantity: qty
            }]);
        }
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    // チェックボックスの変更ハンドラ
    const handleCheckChange = (type, checked) => {
        if (checked) {
            if (!window.confirm(`${type === 'staff' ? '社販' : 'BOSSチェック'}として処理しますか？`)) {
                return; // キャンセルなら何もしない
            }
        }
        if (type === 'staff') setIsStaffSale(checked);
        if (type === 'boss') setIsBossCheck(checked);
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
                    imageData // 画像データ(Base64) ※容量注意
                };
                await axios.post('/api/items', data);
            }

            alert('送信しました！');
            // クリア
            setCart([]);
            setImageData(null);
            setBossId('');
            setIsStaffSale(false);
            setIsBossCheck(false);

        } catch (error) {
            console.error(error);
            alert('送信に失敗しました');
        }
    };

    // カテゴリで商品を絞り込み
    const filteredProducts = PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <div className="pb-28"> {/* 下部のカートボタン表示用に余白を確保 */}
            {/* ヘッダーエリア */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-30">
                <div className="flex justify-between items-center mb-2">
                    <div className="text-gray-500 font-bold">{today}</div>
                    {/* カートバッジ (上部にも表示) */}
                    {cart.length > 0 && (
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md animate-bounce">
                            リスト入力中: {cart.length}件
                        </div>
                    )}
                </div>

                {/* BOSS入力 */}
                <div className="mb-4">
                    <label className="text-xs text-gray-400 font-bold">BOSS</label>
                    <input
                        type="text"
                        value={bossId}
                        onChange={(e) => setBossId(e.target.value)}
                        className="w-full text-2xl font-bold border-b-2 border-gray-300 outline-none p-1"
                        placeholder="番号を入力"
                    />
                </div>

                {/* スタッフ選択 (2列配置) */}
                <div className="mb-2 grid grid-cols-2 gap-4">
                    {/* 梱包スタッフ */}
                    <div>
                        <div className="text-xs text-gray-400 font-bold mb-1">梱包スタッフ</div>
                        <div className="flex flex-col gap-2">
                            {STAFF_LIST.PACKING.map(name => (
                                <button
                                    key={name}
                                    onClick={() => setSelectedStaff(name)}
                                    className={`px-3 py-2 rounded-lg font-bold text-sm border 
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
                        <div className="flex flex-wrap gap-2">
                            {STAFF_LIST.CS.map(name => (
                                <button
                                    key={name}
                                    onClick={() => setSelectedStaff(name)}
                                    className={`px-3 py-2 rounded-lg font-bold text-sm border 
                    ${selectedStaff === name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}
                  `}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 特殊チェック & カメラ */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    {/* チェックボックス */}
                    <div className="space-y-3 p-2 bg-gray-50 rounded-lg">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isStaffSale}
                                onChange={(e) => handleCheckChange('staff', e.target.checked)}
                                className="w-6 h-6"
                            />
                            <span className="font-bold text-sm">社販</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isBossCheck}
                                onChange={(e) => handleCheckChange('boss', e.target.checked)}
                                className="w-6 h-6"
                            />
                            <span className="font-bold text-sm">BOSSチェック</span>
                        </label>
                    </div>

                    {/* カメラ */}
                    <CameraInput onImageCapture={setImageData} label="伝票・商品撮影" />
                </div>
            </div>

            {/* カテゴリタブ */}
            <div className="flex overflow-x-auto gap-2 p-2 bg-gray-100 sticky top-[380px] z-20 shadow-inner">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap shadow-sm
              ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}
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
                        className="h-20 text-lg leading-tight break-words" // 文字サイズ調整
                        onClick={() => handleProductClick(product)}
                    >
                        {product.name}
                    </BigButton>
                ))}
            </div>

            {/* 固定フッターカート (リストに入っているときのみ表示) */}
            {cart.length > 0 && (
                <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] z-40">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-gray-600 flex items-center gap-2">
                            <ShoppingCart size={20} />
                            送信リスト ({cart.length}件)
                        </h3>
                        <button onClick={() => setCart([])} className="text-xs text-red-400 font-bold">全て削除</button>
                    </div>

                    {/* カートの中身プレビュー（最新3件） */}
                    <div className="space-y-1 mb-3 max-h-24 overflow-y-auto text-sm">
                        {cart.map((item, index) => (
                            <div key={index} className="flex justify-between border-b border-gray-50 py-1">
                                <span>{item.name}</span>
                                <span className="font-bold">{item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <BigButton onClick={handleSubmit} variant="primary" className="py-3 text-xl">
                        <Send className="inline mr-2" />
                        まとめて送信
                    </BigButton>
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
