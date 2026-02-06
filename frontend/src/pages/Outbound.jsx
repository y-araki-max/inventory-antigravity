import React, { useState } from 'react';
import axios from 'axios';
import { STAFF_LIST, CATEGORIES, PRODUCTS } from '../data';
import { BigButton } from '../components/BigButton';
import { NumPad } from '../components/NumPad';
import { Trash2, Send } from 'lucide-react';

export default function Outbound() {
    // 入力データ
    const [bossId, setBossId] = useState('');
    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [cart, setCart] = useState([]); // 送信待ちの商品リスト

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

    // 送信処理
    const handleSubmit = async () => {
        if (!bossId) return alert('BOSSIDを入力してください');
        if (!selectedStaff) return alert('担当者を選んでください');
        if (cart.length === 0) return alert('商品を選んでください');

        if (!window.confirm('送信しますか？')) return;

        try {
            // 1件ずつサーバーに送る（本来はまとめて送るAPIを作るのがベストですが、今回はループでシンプルに）
            // あるいは、サーバー側で配列を受け取るように修正するか。
            // server.jsは `newItem` (単一オブジェクト) を期待しています。
            // シンプルにするため、クライアントでループして送ります。

            for (const item of cart) {
                const data = {
                    date: new Date().toISOString(),
                    type: 'OUT',
                    bossId,
                    staff: selectedStaff,
                    name: item.name,
                    productId: item.id,
                    category: item.category,
                    quantity: item.quantity
                };
                await axios.post('/api/items', data);
            }

            alert('送信しました！');
            setCart([]); // クリア
        } catch (error) {
            console.error(error);
            alert('送信に失敗しました');
        }
    };

    // カテゴリで商品を絞り込み
    const filteredProducts = PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <div className="pb-24">
            {/* ヘッダーエリア */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-30">
                <div className="text-gray-500 font-bold mb-2">{today}</div>

                {/* BOSSID入力 */}
                <div className="mb-4">
                    <label className="text-xs text-gray-400 font-bold">BOSSID</label>
                    <input
                        type="text"
                        value={bossId}
                        onChange={(e) => setBossId(e.target.value)}
                        className="w-full text-2xl font-bold border-b-2 border-gray-300 outline-none p-1"
                        placeholder="IDを入力"
                    />
                </div>

                {/* スタッフ選択 */}
                <div className="mb-2">
                    <div className="text-xs text-gray-400 font-bold mb-1">担当者</div>
                    <div className="flex flex-wrap gap-2">
                        {[...STAFF_LIST.PACKING, ...STAFF_LIST.CS].map(name => (
                            <button
                                key={name}
                                onClick={() => setSelectedStaff(name)}
                                className={`px-3 py-1 rounded-full font-bold text-sm border 
                  ${selectedStaff === name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}
                `}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* カテゴリタブ */}
            <div className="flex overflow-x-auto gap-2 p-2 bg-gray-100 sticky top-[160px] z-20">
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
                        className="h-20 text-xl"
                        onClick={() => handleProductClick(product)}
                    >
                        {product.name}
                    </BigButton>
                ))}
            </div>

            {/* 送信待ちリスト（カート） */}
            {cart.length > 0 && (
                <div className="p-4 bg-blue-50 border-t border-blue-100">
                    <h3 className="font-bold text-gray-600 mb-2">送信リスト</h3>
                    <div className="space-y-2 mb-4">
                        {cart.map((item, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                                <span className="font-bold">{item.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold text-blue-600">{item.quantity}個</span>
                                    <button
                                        onClick={() => setCart(cart.filter((_, i) => i !== index))}
                                        className="text-red-400"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <BigButton onClick={handleSubmit} variant="primary">
                        <Send className="inline mr-2" />
                        送信する
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
