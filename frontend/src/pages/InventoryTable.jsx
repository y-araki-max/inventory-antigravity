import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { CATEGORIES } from '../data';
import { MapPin, AlertCircle, Edit2, Save, X } from 'lucide-react';

export default function InventoryTable() {
    const { inventory, loading, updateMemo, adjustStock } = useInventory();
    const [openCategories, setOpenCategories] = useState({});

    // Adjustment Modal State
    const [adjustTarget, setAdjustTarget] = useState(null); // { id, name, currentStock }
    const [adjustValue, setAdjustValue] = useState('');

    const toggleCategory = (cat) => {
        setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const handleAdjustSubmit = () => {
        if (!adjustTarget || adjustValue === '') return;
        const val = parseInt(adjustValue);
        if (!isNaN(val)) {
            adjustStock(adjustTarget.id, val);
        }
        setAdjustTarget(null);
        setAdjustValue('');
    };

    const handleMemoBlur = (id, text) => {
        updateMemo(id, text);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    // Grouping
    let groupedItems = {};
    try {
        groupedItems = CATEGORIES.reduce((acc, cat) => {
            acc[cat] = Object.values(inventory).filter(item => item.category === cat);
            return acc;
        }, {});
    } catch (e) {
        return <div className="p-4 text-red-500">Error rendering table. Please reload.</div>;
    }

    return (
        <div className="pb-32 p-2 bg-gray-50 min-h-screen">
            <h1 className="text-xl font-bold mb-6 ml-2 text-gray-800">在庫一覧・修正 (Strict v7)</h1>

            <div className="space-y-4">
                {CATEGORIES.map(category => {
                    const items = groupedItems[category] || [];
                    if (items.length === 0) return null; // Hide empty categories if needed, or show empty

                    const isOpen = openCategories[category];

                    return (
                        <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div
                                onClick={() => toggleCategory(category)}
                                className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer hover:bg-gray-200"
                            >
                                <h2 className="font-bold text-lg text-gray-800">{category}</h2>
                                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500">{items.length}</span>
                            </div>

                            {/* Grid Body */}
                            {isOpen && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white">
                                    {items.map(item => {
                                        const isLowStock = item.currentStock <= item.reorderPoint;

                                        return (
                                            <div key={item.id} className={`p-4 rounded-lg border-2 ${isLowStock ? 'border-red-100 bg-red-50' : 'border-gray-100 bg-white'}`}>
                                                {/* Product Header */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h3>
                                                        <p className="text-[10px] text-gray-400 mt-1">{item.fullName}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-blue-600'}`}>
                                                            {item.currentStock}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400">現在庫</div>
                                                    </div>
                                                </div>

                                                {/* Info Grid */}
                                                <div className="grid grid-cols-2 gap-2 text-xs mb-3 bg-gray-50 p-2 rounded">
                                                    <div>
                                                        <span className="text-gray-400 block">最新ロット</span>
                                                        <span className="font-mono text-gray-700 font-bold">{item.latestLot || '-'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block">発注点</span>
                                                        <span className={`font-bold ${isLowStock ? 'text-red-500' : 'text-gray-700'}`}>
                                                            {item.reorderPoint}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions / Memo */}
                                                <div className="space-y-2">
                                                    {/* Memo */}
                                                    <div>
                                                        <textarea
                                                            className="w-full text-xs p-1 border border-gray-200 rounded resize-none focus:border-blue-500 focus:outline-none bg-yellow-50"
                                                            rows="2"
                                                            placeholder="メモ (タップして編集)"
                                                            defaultValue={item.memo}
                                                            onBlur={(e) => handleMemoBlur(item.id, e.target.value)}
                                                        />
                                                    </div>

                                                    {/* Adjust Button */}
                                                    <button
                                                        onClick={() => {
                                                            setAdjustTarget({ id: item.id, name: item.name, currentStock: item.currentStock });
                                                            setAdjustValue(item.currentStock);
                                                        }}
                                                        className="w-full py-1.5 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                                                    >
                                                        <Edit2 size={12} />
                                                        在庫数修正
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Adjustment Modal */}
            {adjustTarget && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                        <h3 className="font-bold text-lg mb-1">{adjustTarget.name}</h3>
                        <p className="text-xs text-gray-500 mb-6">実在庫を入力してください。差分が自動計算されます。</p>

                        <div className="flex gap-4 items-center mb-6 justify-center">
                            <button
                                onClick={() => setAdjustValue(Number(adjustValue) - 1)}
                                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold hover:bg-gray-200"
                            >-</button>
                            <input
                                type="number"
                                pattern="\d*"
                                className="w-24 text-center text-3xl font-bold border-b-2 border-blue-500 focus:outline-none"
                                value={adjustValue}
                                onChange={(e) => setAdjustValue(e.target.value)}
                            />
                            <button
                                onClick={() => setAdjustValue(Number(adjustValue) + 1)}
                                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold hover:bg-gray-200"
                            >+</button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setAdjustTarget(null)}
                                className="py-3 text-gray-500 font-bold bg-gray-100 rounded-lg"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleAdjustSubmit}
                                className="py-3 text-white font-bold bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                修正確定
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
