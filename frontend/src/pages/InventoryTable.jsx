import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { CATEGORIES, PRODUCTS } from '../data';
import { MapPin, Edit2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export default function InventoryTable() {
    const {
        inventory,
        loading,
        updateMemo,
        adjustStock,
        viewYear, setViewYear,
        viewMonth, setViewMonth
    } = useInventory();

    const [openCategories, setOpenCategories] = useState({});
    const [expandedProducts, setExpandedProducts] = useState(new Set());
    const [adjustTarget, setAdjustTarget] = useState(null);
    const [adjustValue, setAdjustValue] = useState('');

    const toggleCategory = (cat) => {
        setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const toggleProductCalendar = (id) => {
        setExpandedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
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

    if (loading) return <div className="p-8 text-center bg-gray-50 text-gray-600">読み込み中...</div>;

    // Group PRODUCTS (Master Data) by Category to ensure display even if inventory state is empty
    const groupedItems = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = PRODUCTS.filter(p => p.category === cat);
        return acc;
    }, {});

    return (
        <div className="pb-32 p-2 bg-gray-50 min-h-screen">
            {/* Header with Month Selector */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 ml-2 mr-2">
                <h1 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">在庫一覧 (Strict v9.0)</h1>

                <div className="flex items-center gap-2 bg-white p-2 rounded shadow-sm border border-gray-200">
                    <Calendar size={18} className="text-blue-600" />
                    <span className="text-xs font-bold text-gray-500">表示月:</span>
                    <select
                        value={viewYear}
                        onChange={(e) => setViewYear(Number(e.target.value))}
                        className="font-bold text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer"
                    >
                        <option value={2026}>2026年</option>
                        <option value={2025}>2025年</option>
                    </select>
                    <select
                        value={viewMonth}
                        onChange={(e) => setViewMonth(Number(e.target.value))}
                        className="font-bold text-lg text-blue-600 bg-transparent border-none focus:ring-0 cursor-pointer"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                            <option key={m} value={m}>{m}月</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {CATEGORIES.map(category => {
                    const items = groupedItems[category] || [];
                    if (items.length === 0) return null;
                    const isOpen = openCategories[category];

                    return (
                        <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div
                                onClick={() => toggleCategory(category)}
                                className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                            >
                                <h2 className="font-bold text-lg text-gray-800">{category}</h2>
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 shadow-sm">{items.length}</span>
                            </div>

                            {isOpen && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white">
                                    {items.map(product => {
                                        // Safe Data Lookup
                                        const item = inventory[product.id] || {
                                            ...product,
                                            currentStock: 0,
                                            dailyHistory: [],
                                            lots: [],
                                            memo: ''
                                        };

                                        const rp = item.reorderPoint !== '-' ? item.reorderPoint : 0;
                                        const isLowStock = rp > 0 && item.currentStock <= rp;
                                        const isCalendarOpen = expandedProducts.has(item.id);

                                        return (
                                            <div key={item.id} className={`p-4 rounded-lg border-2 transition-all ${isLowStock ? 'border-red-100 bg-red-50/50' : 'border-gray-100 bg-white'}`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
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
                                                        <div className="text-[10px] text-gray-400">{viewMonth}月末在庫</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 text-xs mb-3 bg-gray-50 p-2 rounded border border-gray-100">
                                                    <div>
                                                        <span className="text-gray-400 block text-[10px]">最新ロット</span>
                                                        <div className="flex flex-col">
                                                            {item.lots && item.lots.length > 0 ? (
                                                                item.lots.map((lot, idx) => (
                                                                    <span key={lot} className={`font-mono leading-tight ${idx === 0 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                                                        {lot}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="font-mono text-gray-300">-</span>
                                                            )}
                                                        </div>
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

                                                <div className="space-y-2">
                                                    <textarea
                                                        className="w-full text-xs p-2 border border-yellow-200 rounded resize-none focus:border-yellow-400 focus:outline-none bg-yellow-50/50"
                                                        rows="2"
                                                        placeholder="メモ"
                                                        defaultValue={item.memo}
                                                        onBlur={(e) => updateMemo(item.id, e.target.value)}
                                                    />

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

                                                {isCalendarOpen && (
                                                    <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 animate-in slide-in-from-top-2 duration-200">
                                                        <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                                                            <MapPin size={12} />
                                                            日次推移 ({viewYear}年{viewMonth}月)
                                                        </h4>
                                                        <div className="overflow-x-auto border border-gray-200 rounded bg-white max-h-60 overflow-y-auto">
                                                            <table className="w-full text-center text-xs whitespace-nowrap">
                                                                <thead className="bg-gray-100 text-gray-600 font-medium sticky top-0 z-10 shadow-sm">
                                                                    <tr>
                                                                        <th className="p-1 min-w-[30px] bg-gray-100">日</th>
                                                                        <th className="p-1 min-w-[30px] border-l border-gray-200 bg-gray-100">入</th>
                                                                        <th className="p-1 min-w-[30px] border-l border-gray-200 bg-gray-100">出</th>
                                                                        <th className="p-1 min-w-[30px] border-l border-gray-200 bg-gray-100">サ</th>
                                                                        <th className="p-1 min-w-[40px] border-l border-gray-200 bg-gray-100">在庫</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(() => {
                                                                        // Strict v11.3: Robust Date Calculation & Forced Render
                                                                        const y = Number(viewYear);
                                                                        const m = Number(viewMonth);
                                                                        // new Date(year, monthIndex, day)
                                                                        // If m is 2 (Feb), we want days in Feb.
                                                                        // monthIndex for Date is 0-indexed (Jan=0, Feb=1).
                                                                        // But using day=0 convention: new Date(y, m, 0) gives last day of month "m-1" (index).
                                                                        // If m=2, new Date(y, 2, 0) -> Month Index 2 is March. Day 0 of March is Last day of Feb.
                                                                        // So new Date(2026, 2, 0).getDate() returns 28. Correct.

                                                                        const daysInMonth = new Date(y, m, 0).getDate();
                                                                        console.log(`[Calendar Debug v11.3] Year:${y} Month:${m} Days:${daysInMonth}`);

                                                                        // Force loop even if daysInMonth is weird (fallback to 31 if NaN to verify layout?)
                                                                        // But usually Number check is enough.
                                                                        const safeDays = (daysInMonth && !isNaN(daysInMonth)) ? daysInMonth : 30; // Fallback to 30 just in case to show *something*

                                                                        return Array.from({ length: safeDays }, (_, i) => i + 1).map((d) => {
                                                                            // Construct date object for dow styling
                                                                            // new Date(y, m-1, d) -> month param is 0-indexed.
                                                                            // if m=2 (Feb), m-1=1. new Date(2026, 1, d). Correct.
                                                                            const dateObj = new Date(y, m - 1, d);
                                                                            const dayNum = dateObj.getDay();
                                                                            const isSat = dayNum === 6;
                                                                            const isSun = dayNum === 0;
                                                                            const rowClass = isSat ? 'bg-blue-50' : isSun ? 'bg-red-50' : (d % 2 === 0 ? 'bg-white' : 'bg-gray-50');

                                                                            // Date String for Lookup: YYYY-MM-DD
                                                                            const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

                                                                            // Robust Lookup
                                                                            const dayData = item.dailyHistory ? item.dailyHistory.find(h => h.date === dateStr) : null;

                                                                            return (
                                                                                <tr key={d} className={`${rowClass} border-b border-gray-100 last:border-0`}>
                                                                                    {/* Strict v11.3: Robust Weekend Colors */}
                                                                                    <td className={`p-1 font-bold ${isSat ? 'text-blue-600' : isSun ? 'text-red-600' : 'text-gray-700'}`}>
                                                                                        {d}
                                                                                    </td>
                                                                                    <td className="p-1 border-l border-gray-100 text-blue-600">
                                                                                        {dayData && dayData.in > 0 ? dayData.in : ''}
                                                                                    </td>
                                                                                    <td className="p-1 border-l border-gray-100 text-gray-600">
                                                                                        {dayData && dayData.out > 0 ? dayData.out : ''}
                                                                                    </td>
                                                                                    <td className="p-1 border-l border-gray-100 text-green-600">
                                                                                        {dayData && dayData.sample > 0 ? dayData.sample : ''}
                                                                                    </td>
                                                                                    <td className="p-1 border-l border-gray-100 font-bold text-gray-800">
                                                                                        {dayData ? dayData.stock : '-'}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        });
                                                                    })()}
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

            {adjustTarget && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                        <h3 className="font-bold text-lg mb-1 text-gray-800">{adjustTarget.name}</h3>
                        <p className="text-xs text-gray-500 mb-6 font-bold text-red-500">
                            ※ 現在表示中の {viewMonth}月 の在庫を基準に修正します。
                        </p>

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
