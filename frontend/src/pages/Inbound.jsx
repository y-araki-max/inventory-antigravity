import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { STAFF_LIST, CATEGORIES, PRODUCTS } from '../data';
import { BigButton } from '../components/BigButton';
import { storage } from '../utils/storage';

const FACTORY_LIST = [
    'HIA', 'HIB', 'HIC', 'HID', 'HIE', 'HIF', 'HIG', 'HIH',
    'HAA', 'HAB', 'HAC',
    'HPA', 'HPB',
    'HLA', 'HLB', 'HLC',
    'HCA', 'HCB',
    'HSA', 'HSB',
    'HPC', 'HPE',
    'HBA', 'HBB', 'HBC', 'HBD',
    'HNA',
    'HKA', 'HKB',
    'HRA', 'HRB',
    'HMA',
    'HYA', 'HYB',
    'HHA', 'HHB',
    'HTA'
];

export default function Inbound() {
    const [selectedStaff, setSelectedStaff] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [quantity, setQuantity] = useState('');

    // SMART LOT INPUT STATES
    const currentYear = new Date().getFullYear();
    const [lotYear, setLotYear] = useState(currentYear);
    const [lotMonth, setLotMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'));
    const [lotBranch, setLotBranch] = useState(' '); // Default space (No Branch)
    const [lotFactory, setLotFactory] = useState(FACTORY_LIST[0]);

    const [lotNo, setLotNo] = useState('');

    // Auto-generate LotNo
    useEffect(() => {
        // Format: [Year].[Month]-[Branch]/[Factory]
        // If Branch is ' ', it becomes "- /"
        const branchPart = lotBranch === ' ' ? ' ' : lotBranch;
        const formatted = `${lotYear}.${lotMonth}-${branchPart}/${lotFactory}`;
        setLotNo(formatted);
    }, [lotYear, lotMonth, lotBranch, lotFactory]);

    const handleSubmit = async () => {
        if (!selectedStaff) return alert('担当者を選んでください');
        if (!selectedProduct) return alert('商品を選んでください');
        if (!quantity) return alert('数量を入れてください');
        if (!lotNo) return alert('ロット番号が生成されていません');

        if (!window.confirm(`以下の内容で入庫登録しますか？\n\n商品: ${selectedProduct.name}\n数量: ${quantity}\nロット: ${lotNo}`)) return;

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
                lotNo: lotNo, // Saved as strict format
            };

            // API送信
            await axios.post('/api/items', data);

            // localStorageに保存
            storage.saveItem(data);

            alert('入庫しました！');

            // クリア
            setQuantity('');
            // Reset Lot to defaults? Keep for convenience? Let's reset.
            // setLotYear(currentYear);
            // setLotMonth(...);
            setSelectedProduct(null);

        } catch (error) {
            console.error(error);
            alert('エラーが発生しました');
        }
    };

    const filteredProducts = PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <div className="pb-24 p-4">
            <h1 className="text-xl font-bold mb-4">入庫入力 (Strict v28)</h1>

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

                {/* SMART LOT INPUT */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <label className="block text-sm font-bold text-blue-800 mb-2">ロット番号構成</label>

                    <div className="grid grid-cols-4 gap-2 mb-2">
                        {/* YEAR */}
                        <div>
                            <span className="text-[10px] text-gray-500 block mb-1">年</span>
                            <select
                                value={lotYear}
                                onChange={(e) => setLotYear(e.target.value)}
                                className="w-full text-sm font-bold p-2 border rounded bg-white"
                            >
                                {[0, 1, 2, 3, 4].map(i => (
                                    <option key={i} value={currentYear + i}>{currentYear + i}</option>
                                ))}
                            </select>
                        </div>

                        {/* MONTH */}
                        <div>
                            <span className="text-[10px] text-gray-500 block mb-1">月</span>
                            <select
                                value={lotMonth}
                                onChange={(e) => setLotMonth(e.target.value)}
                                className="w-full text-sm font-bold p-2 border rounded bg-white"
                            >
                                {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>

                        {/* BRANCH */}
                        <div>
                            <span className="text-[10px] text-gray-500 block mb-1">枝</span>
                            <select
                                value={lotBranch}
                                onChange={(e) => setLotBranch(e.target.value)}
                                className="w-full text-sm font-bold p-2 border rounded bg-white"
                            >
                                <option value=" ">なし</option>
                                {['A', 'B', 'C', 'D', 'E', 'F'].map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                        </div>

                        {/* FACTORY */}
                        <div>
                            <span className="text-[10px] text-gray-500 block mb-1">記号</span>
                            <select
                                value={lotFactory}
                                onChange={(e) => setLotFactory(e.target.value)}
                                className="w-full text-sm font-bold p-2 border rounded bg-white"
                            >
                                {FACTORY_LIST.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-2 text-right">
                        <span className="text-xs text-gray-400 mr-2">生成プレビュー:</span>
                        <span className="font-mono font-bold text-lg text-blue-700 bg-white px-2 py-1 rounded border border-blue-200 inline-block">
                            {lotNo}
                        </span>
                    </div>
                </div>

                <BigButton onClick={handleSubmit} variant="primary">
                    登録する
                </BigButton>
            </div>

        </div>
    );
}
