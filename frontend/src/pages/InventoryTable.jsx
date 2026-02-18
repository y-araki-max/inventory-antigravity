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
        viewMonth, setViewMonth,
        transactions // Strict v13.3: for Inline Calc
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
                        {(() => {
                            const currentYear = new Date().getFullYear();
                            // Generate range: Current - 1 to Current + 5
                            const startYear = currentYear - 1;
                            const endYear = currentYear + 5;
                            const years = [];
                            for (let y = startYear; y <= endYear; y++) {
                                years.push(y);
                            }
                            return years.map(year => (
                                <option key={year} value={year}>{year}年</option>
                            ));
                        })()}
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
                                                                        // Strict v12.1: Fail-Safe Calendar Logic
                                                                        let y = Number(viewYear);
                                                                        let m = Number(viewMonth);

                                                                        // Safety Defaults
                                                                        if (!y || isNaN(y)) y = 2026;
                                                                        if (!m || isNaN(m)) m = 1;

                                                                        // Get Last Day of Month
                                                                        // new Date(y, m, 0) -> 0th day of month (m+1) -> Last day of month m.
                                                                        let daysInMonth = new Date(y, m, 0).getDate();

                                                                        // Absolute Fail-Safe: If calculation fails, default to 31 to show *something* rather than error
                                                                        if (!daysInMonth || isNaN(daysInMonth)) {
                                                                            console.warn('[Strict v12.1] Date Logic Fallback triggered', y, m);
                                                                            daysInMonth = 31;
                                                                        }

                                                                        console.log(`[Calendar v12.1] Year:${y} Month:${m} Days:${daysInMonth}`);

                                                                        return Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                                                                            // Day of Week
                                                                            // m is 1-12. Date month index is m-1.
                                                                            const dateObj = new Date(y, m - 1, d);
                                                                            const dayOfWeek = dateObj.getDay(); // 0:Sun, 6:Sat

                                                                            const isSat = dayOfWeek === 6;
                                                                            const isSun = dayOfWeek === 0;

                                                                            // Strict Styling
                                                                            const rowClass = isSat ? 'bg-blue-50' : isSun ? 'bg-red-50' : (d % 2 === 0 ? 'bg-white' : 'bg-gray-50');
                                                                            // Use inline styles or strict classes for text color
                                                                            const textClass = isSat ? 'text-blue-600 font-bold' : isSun ? 'text-red-600 font-bold' : 'text-gray-700 font-bold';

                                                                            // Data Lookup String: YYYY-MM-DD
                                                                            const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                                                            const dayData = item.dailyHistory ? item.dailyHistory.find(h => h.date === dateStr) : null;

                                                                            return (
                                                                                <tr key={d} className={`${rowClass} border-b border-gray-100 last:border-0`}>
                                                                                    <td className={`p-1 text-center ${textClass}`}>
                                                                                        {d}
                                                                                    </td>
                                                                                    <td className="p-1 border-l border-gray-100 text-blue-600">
                                                                                        {dayData && dayData.in > 0 ? dayData.in : ''}
                                                                                    </td>
                                                                                    {/* Strict v13: Large Purchase Indicator & Data Sync */}
                                                                                    <td className="p-1 border-l border-gray-100 text-gray-600 relative group">
                                                                                        {dayData && dayData.out > 0 ? dayData.out : ''}
                                                                                        {dayData && (dayData.out >= 10) && (
                                                                                            <>
                                                                                                {/* Triangle Marker */}
                                                                                                <span className="absolute top-0 right-0 w-0 h-0 border-t-[6px] border-r-[6px] border-t-red-500 border-r-transparent transform rotate-0"></span>

                                                                                                {/* Tooltip */}
                                                                                                <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-50 whitespace-nowrap min-w-[120px]">
                                                                                                    <div className="font-bold border-b border-gray-600 mb-1 pb-1 text-yellow-400">
                                                                                                        合計: {dayData.out}個
                                                                                                    </div>
                                                                                                    {dayData.outDetails && dayData.outDetails.length > 0 ? (
                                                                                                        dayData.outDetails.map((d, dx) => (
                                                                                                            <div key={dx} className="flex justify-between gap-4">
                                                                                                                <span>{d.bossId || '指定なし'}</span>
                                                                                                                <span className="font-bold">{d.quantity}</span>
                                                                                                            </div>
                                                                                                        ))
                                                                                                    ) : (
                                                                                                        <div className="text-gray-400 italic">詳細なし</div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="p-1 border-l border-gray-100 text-green-600">
                                                                                        {dayData && dayData.sample > 0 ? dayData.sample : ''}
                                                                                    </td>
                                                                                    {/* Running Stock Calculation display */}
                                                                                    <td className="p-1 border-l border-gray-100 font-bold text-gray-800">
                                                                                        {dayData ? dayData.stock : '-'}
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
