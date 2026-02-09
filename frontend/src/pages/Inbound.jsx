import React, { useState } from 'react';
import axios from 'axios';
import { STAFF_LIST, CATEGORIES, PRODUCTS } from '../data';
import { BigButton } from '../components/BigButton';
import { storage } from '../utils/storage';

export default function Inbound() {
    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [quantity, setQuantity] = useState('');
    const [lotNo, setLotNo] = useState('');

    const handleSubmit = async () => {
        if (!selectedStaff) return alert('担当者を選んでください');
        if (!selectedProduct) return alert('商品を選んでください');
        if (!quantity) return alert('数量を入れてください');

        if (!window.confirm('入庫登録しますか？')) return;

        try {
            const data = {
                uuid: crypto.randomUUID(), // 一意なID
                date: new Date().toISOString(),
                type: 'IN',
                staff: selectedStaff,
                name: selectedProduct.name,
                fullName: selectedProduct.fullName, // 正式名称も保存
                productId: selectedProduct.id,
                category: selectedProduct.category,
                quantity: parseInt(quantity),
                lotNo: lotNo,
            };

            // API送信
            await axios.post('/api/items', data);

            // localStorageに保存
            storage.saveItem(data);

            alert('入庫しました！');

            // クリア
            setQuantity('');
            setLotNo('');
            setSelectedProduct(null);

        } catch (error) {
            console.error(error);
            alert('エラーが発生しました');
        }
    };

    const filteredProducts = PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <div className="pb-24 p-4">
            <h1 className="text-xl font-bold mb-4">入庫入力</h1>

            {/* スタッフ選択 */}
            <div className="mb-4">
                <label className="text-xs text-gray-400 font-bold block mb-2">企画部担当者</label>
                <div className="flex gap-2">
                    {STAFF_LIST.PLANNING.map(name => (
                        <button
                            key={name}
                            onClick={() => setSelectedStaff(name)}
                            className={`px-4 py-2 rounded-lg font-bold border ${selectedStaff === name ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            {/* カテゴリ */}
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full font-bold whitespace-nowrap border ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* 商品選択 */}
            <div className="mb-6 bg-gray-100 p-2 rounded-xl overflow-x-auto flex gap-2">
                {filteredProducts.map(product => (
                    <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`flex-shrink-0 px-4 py-4 rounded-lg font-bold shadow-sm transition-colors border-2 ${selectedProduct?.id === product.id ? 'border-blue-600 bg-white text-blue-600' : 'border-transparent bg-white text-gray-600'
                            }`}
                    >
                        {product.name}
                    </button>
                ))}
            </div>

            {/* 入力フォーム */}
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">選択中の商品</label>
                    <div className="text-xl font-bold">{selectedProduct?.name || '未選択'}</div>
                    {selectedProduct && <div className="text-xs text-gray-400">{selectedProduct.fullName}</div>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">入庫数</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        className="w-full text-3xl font-bold p-2 border rounded-lg bg-gray-50"
                        placeholder="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">ロット番号</label>
                    <input
                        type="text"
                        value={lotNo}
                        onChange={e => setLotNo(e.target.value)}
                        className="w-full text-lg p-2 border rounded-lg bg-gray-50"
                        placeholder="L-..."
                    />
                </div>

                <BigButton onClick={handleSubmit} variant="primary">
                    登録する
                </BigButton>
            </div>

        </div>
    );
}
