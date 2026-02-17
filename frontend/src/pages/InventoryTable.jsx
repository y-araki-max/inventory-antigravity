import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { CATEGORIES } from '../data';
import { MapPin, AlertCircle, Edit2, Save, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function InventoryTable() {
    const { inventory, loading, updateMemo, adjustStock } = useInventory();
    const [openCategories, setOpenCategories] = useState({});

    // Strict v8: Calendar Expansion State (Key: ProductID)
    const [expandedProduct, setExpandedProduct] = useState(null);

    // Adjustment Modal State
    const [adjustTarget, setAdjustTarget] = useState(null); // { id, name, currentStock }
    const [adjustValue, setAdjustValue] = useState('');

    const toggleCategory = (cat) => {
        setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const toggleProductCalendar = (id) => {
        setExpandedProduct(prev => (prev === id ? null : id));
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

    if (loading) return <div className="p-8 text-center bg-gray-50 text-gray-600">読み込み中...</div>;

    // Grouping
    let groupedItems = {};
    try {
        groupedItems = CATEGORIES.reduce((acc, cat) => {
            acc[cat] = Object.values(inventory).filter(item => item.category === cat);
            return acc;
        }, {});
    } catch (e) {
        return <div className="p-4 text-red-500">データエラーが発生しました。リロードしてください。</div>;
    }

    return (
        <div className="pb-32 p-2 bg-gray-50 min-h-screen">
            <h1 className="text-xl font-bold mb-6 ml-2 text-gray-800">在庫一覧・修正 (Strict v8)</h1>

            <div className="space-y-4">
                {CATEGORIES.map(category => {
                    const items = groupedItems[category] || [];
                    if (items.length === 0) return null;

                    const isOpen = openCategories[category];

                    return (
                        <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div
                                onClick={() => toggleCategory(category)}
                                className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                            >
                                <h2 className="font-bold text-lg text-gray-800">{category}</h2>
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 shadow-sm">{items.length}</span>
                            </div>

                            {/* Grid Body */}
                            {isOpen && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white">
                                    {items.map(item => {
                                        // Master Data vs Stock Checks
                                        const rp = item.reorderPoint !== '-' ? item.reorderPoint : 0;
                                        const isLowStock = rp > 0 && item.currentStock <= rp;
                                        const isCalendarOpen = expandedProduct === item.id;

                                        return (
                                            <div key={item.id} className={`p-4 rounded-lg border-2 transition-all ${isLowStock ? 'border-red-100 bg-red-50/50' : 'border-gray-100 bg-white'}`}>
                                                {/* Product Header */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        {/* Clickable Name for Calendar */}
                                                        <button
                                                            onClick={() => toggleProductCalendar(item.id)}
                                                            className="text-left font-bold text-gray-800 text-lg leading-tight hover:text-blue-600 hover:underline decoration-2 underline-offset-2 flex items-center gap-1"
                                                        >
                                                            {item.name}
                                                            {isCalendarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </button>
                                                        <p className="text-[10px] text-gray-400 mt-1">{item.fullName}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-blue-600'}`}>
                                                            {item.currentStock.toLocaleString()}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400">現在庫</div>
                                                    </div>
                                                </div>

                                                {/* Info Grid */}
                                                <div className="grid grid-cols-3 gap-2 text-xs mb-3 bg-gray-50 p-2 rounded border border-gray-100">
                                                    <div>
                                                        <span className="text-gray-400 block text-[10px]">最新ロット</span>
                                                        <span className="font-mono text-gray-700 font-bold">{item.latestLot || '-'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block text-[10px]">発注点</span>
                                                        <span className={`font-bold ${isLowStock ? 'text-red-500' : 'text-gray-700'}`}>
                                                            {item.reorderPoint !== '-' ? item.reorderPoint.toLocaleString() : '-'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block text-[10px]">平均出庫</span>
                                                        <span className="text-gray-700 font-medium">
                                                            {item.avgDailyOut !== '-' ? item.avgDailyOut.toLocaleString() : '-'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions / Memo */}
                                                <div className="space-y-2">
                                                    {/* Memo */}
                                                    <textarea
                                                        className="w-full text-xs p-2 border border-yellow-200 rounded resize-none focus:border-yellow-400 focus:outline-none bg-yellow-50/50"
                                                        rows="2"
                                                        placeholder="メモ (タップして編集)"
                                                        defaultValue={item.memo}
                                                        onBlur={(e) => handleMemoBlur(item.id, e.target.value)}
                                                    />

                                                    {/* Adjust Button */}
                                                    <button
                                                        onClick={() => {
                                                            setAdjustTarget({ id: item.id, name: item.name, currentStock: item.currentStock });
                                                            setAdjustValue(item.currentStock);
                                                        }}
                                                        className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 border border-gray-200"
                                                    >
                                                        <Edit2 size={12} />
                                                        在庫数修正
                                                    </button>
                                                </div>

                                                {/* Calendar Accordion (Strict v8) */}
                                                {isCalendarOpen && (
                                                    <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200">
                                                        <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                                                            <MapPin size={12} />
                                                            日次推移 (2026年2月)
                                                        </h4>
                                                        <div className="overflow-x-auto border border-gray-200 rounded bg-white">
                                                            <table className="w-full text-center text-xs whitespace-nowrap">
                                                                <thead className="bg-gray-100 text-gray-600 font-medium">
                                                                    <tr>
                                                                        <th className="p-1 min-w-[30px]">日</th>
                                                                        <th className="p-1 min-w-[30px] border-l border-gray-200">入</th>
                                                                        <th className="p-1 min-w-[30px] border-l border-gray-200">出</th>
                                                                        <th className="p-1 min-w-[30px] border-l border-gray-200">サン</th>
                                                                        <th className="p-1 min-w-[40px] border-l border-gray-200">在庫</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {item.dailyHistory && item.dailyHistory.map((day, idx) => {
                                                                        const dayNum = day.dateObj.getDay();
                                                                        const isSat = dayNum === 6;
                                                                        const isSun = dayNum === 0;
                                                                        const rowClass = isSat ? 'bg-blue-50' : isSun ? 'bg-red-50' : (idx % 2 === 0 ? 'bg-white' : 'bg-gray-50');

                                                                        return (
                                                                            <tr key={day.date} className={`${rowClass} border-b border-gray-100 last:border-0`}>
                                                                                <td className={`p-1 ${isSat ? 'text-blue-600' : isSun ? 'text-red-600' : 'text-gray-700'} font-medium`}>
                                                                                    {day.dateObj.getDate()}
                                                                                </td>
                                                                                <td className="p-1 border-l border-gray-100 text-blue-600">{day.in > 0 ? day.in : ''}</td>
                                                                                <td className="p-1 border-l border-gray-100 text-gray-600">{day.out > 0 ? day.out : ''}</td>
                                                                                <td className="p-1 border-l border-gray-100 text-green-600">{day.sample > 0 ? day.sample : ''}</td>
                                                                                <td className="p-1 border-l border-gray-100 font-bold text-gray-800">{day.stock}</td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                        <h3 className="font-bold text-lg mb-1 text-gray-800">{adjustTarget.name}</h3>
                        <p className="text-xs text-gray-500 mb-6">実在庫を入力してください。差分が自動計算されます。</p>

                        <div className="flex gap-4 items-center mb-6 justify-center">
                            <button
                                onClick={() => setAdjustValue(prev => Number(prev) - 1)}
                                className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xl font-bold hover:bg-gray-200 transition-colors"
                            >-</button>
                            <input
                                type="number"
                                pattern="\d*"
                                className="w-24 text-center text-3xl font-bold border-b-2 border-blue-500 focus:outline-none text-gray-800"
                                value={adjustValue}
                                onChange={(e) => setAdjustValue(e.target.value)}
                            />
                            <button
                                onClick={() => setAdjustValue(prev => Number(prev) + 1)}
                                className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xl font-bold hover:bg-gray-200 transition-colors"
                            >+</button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setAdjustTarget(null)}
                                className="py-3 text-gray-500 font-bold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={handleAdjustSubmit}
                                className="py-3 text-white font-bold bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-blue-200 shadow-lg"
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
