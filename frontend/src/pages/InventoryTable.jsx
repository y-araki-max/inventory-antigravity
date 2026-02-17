import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { CATEGORIES } from '../data';
import { ChevronDown, ChevronRight, AlertTriangle, Package } from 'lucide-react';

export default function InventoryTable() {
    const { inventory, loading } = useInventory();
    const [openCategories, setOpenCategories] = useState({});
    const [openProducts, setOpenProducts] = useState({});

    const toggleCategory = (cat) => {
        setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const toggleProduct = (id) => {
        setOpenProducts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    // Group items by category
    const groupedItems = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = Object.values(inventory).filter(item => item.category === cat);
        return acc;
    }, {});

    return (
        <div className="pb-24 p-2 min-h-screen bg-gray-50">
            <h1 className="text-xl font-bold mb-4 ml-2">在庫管理表</h1>

            <div className="space-y-2">
                {CATEGORIES.map(category => {
                    const items = groupedItems[category] || [];
                    if (items.length === 0) return null;

                    const isOpen = openCategories[category];

                    return (
                        <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Category Header */}
                            <div
                                onClick={() => toggleCategory(category)}
                                className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
                            >
                                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                    {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    {category}
                                    <span className="text-sm font-normal text-gray-500">({items.length})</span>
                                </h2>
                            </div>

                            {/* Product List */}
                            {isOpen && (
                                <div className="divide-y divide-gray-100">
                                    {items.map(item => {
                                        const isProductOpen = openProducts[item.id];
                                        const isLowStock = item.reorderPoint > 0 && item.currentStock <= item.reorderPoint;

                                        return (
                                            <div key={item.id} className="bg-white">
                                                {/* Main Row */}
                                                <div
                                                    onClick={() => toggleProduct(item.id)}
                                                    className="p-3 flex justify-between items-center cursor-pointer hover:bg-blue-50"
                                                >
                                                    <div className="flex-1">
                                                        <div className="font-bold text-gray-800 flex items-center gap-2">
                                                            {item.name}
                                                            {isLowStock && <AlertTriangle size={16} className="text-red-500" />}
                                                        </div>
                                                        <div className="text-xs text-gray-400">{item.fullName}</div>
                                                    </div>

                                                    <div className="flex gap-4 text-right">
                                                        <div>
                                                            <div className="text-[10px] text-gray-400">現在庫</div>
                                                            <div className={`font-bold text-lg ${isLowStock ? 'text-red-600' : 'text-blue-600'}`}>
                                                                {item.currentStock.toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-gray-400">本日出庫</div>
                                                            <div className="font-bold text-gray-700">
                                                                {item.todayOut > 0 ? item.todayOut : '-'}
                                                                {item.todaySample > 0 && <span className="text-xs text-gray-400 ml-1">(サ{item.todaySample})</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Detail Row (Accordion) */}
                                                {isProductOpen && (
                                                    <div className="bg-gray-50 p-3 text-xs border-t border-gray-100">
                                                        {/* Stats Grid */}
                                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <div className="text-gray-400 mb-1">発注点</div>
                                                                <div className="font-bold text-gray-700">{item.reorderPoint ? item.reorderPoint.toLocaleString() : '-'}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-gray-400 mb-1">今月合計出庫</div>
                                                                <div className="font-bold text-gray-700">{item.monthOut.toLocaleString()}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-gray-400 mb-1">平均出庫(CSV)</div>
                                                                <div className="font-bold text-gray-700">{item.averageOut ? item.averageOut.toLocaleString() : '-'}</div>
                                                            </div>
                                                        </div>

                                                        {/* Daily History Table */}
                                                        <div>
                                                            <div className="text-gray-400 mb-2 font-bold">日別入出庫・在庫推移</div>
                                                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                                                <table className="w-full text-center whitespace-nowrap">
                                                                    <thead className="bg-gray-100 text-gray-500 font-medium">
                                                                        <tr>
                                                                            <th className="px-2 py-1">日付</th>
                                                                            <th className="px-2 py-1 text-green-600">入庫</th>
                                                                            <th className="px-2 py-1 text-red-600">出庫</th>
                                                                            <th className="px-2 py-1 text-gray-500">サンプル</th>
                                                                            <th className="px-2 py-1 text-blue-600">在庫</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100 bg-white">
                                                                        {item.dailyHistory && item.dailyHistory.map((day, idx) => {
                                                                            const dayOfWeek = day.dateObj.getDay(); // 0:Sun, 6:Sat
                                                                            const isSat = dayOfWeek === 6;
                                                                            const isSun = dayOfWeek === 0;

                                                                            let rowClass = "text-gray-700";
                                                                            if (isSat) rowClass = "bg-blue-50 text-blue-700 font-medium";
                                                                            if (isSun) rowClass = "bg-red-50 text-red-700 font-medium";

                                                                            const dateLabel = `${day.dateObj.getMonth() + 1}/${day.dateObj.getDate()} (${['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]})`;

                                                                            return (
                                                                                <tr key={idx} className={rowClass}>
                                                                                    <td className="px-2 py-1 text-left">{dateLabel}</td>
                                                                                    <td className="px-2 py-1">{day.in > 0 ? day.in : '-'}</td>
                                                                                    <td className="px-2 py-1">{day.out > 0 ? day.out : '-'}</td>
                                                                                    <td className="px-2 py-1">{day.sample > 0 ? `(${day.sample})` : '-'}</td>
                                                                                    <td className="px-2 py-1 font-bold">{day.stock.toLocaleString()}</td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                        {(!item.dailyHistory || item.dailyHistory.length === 0) && (
                                                                            <tr>
                                                                                <td colSpan="5" className="px-2 py-4 text-gray-400">データがありません</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
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

            {/* Legend */}
            <div className="mt-8 p-4 text-xs text-gray-500 bg-white rounded-lg">
                <p>※ (サ) はサンプル出庫数を含みます</p>
                <p>※ 現在庫 = 1月末在庫(CSV) + 2月以降の入庫 - 2月以降の出庫</p>
                <p>※ <AlertTriangle size={12} className="inline text-red-500" /> マークは在庫が発注点を下回っています</p>
            </div>
        </div>
    );
}
