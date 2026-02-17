import React, { useEffect, useState } from 'react';
import { PRODUCTS, normalizeTerm } from '../data';
import { Loader2, Calendar, AlertCircle } from 'lucide-react';
import { storage } from '../utils/storage';

export default function Aggregation() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = storage.getItems();
            if (!Array.isArray(data)) {
                throw new Error('データ形式が不正です');
            }

            const filtered = data.filter(item => {
                if (!item || !item.date) return false;
                // Add robust date parsing if needed, but simple string comparison is usually safe for ISO dates
                return item.date.startsWith(selectedDate);
            });

            setItems(filtered);
        } catch (error) {
            console.error('データ取得エラー', error);
            setError('データの読み込みに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    // Total Calculation
    const totalOutbound = items
        .filter(item => item.type === 'OUT') // Includes 'Sample' as they are type='OUT'
        .reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);

    // Aggregation Logic (Refactored to show ALL products)
    const aggregated = PRODUCTS.map(product => {
        const pid = product.id;
        const pname = product.name;
        const pcategory = product.category;

        let inCount = 0;
        let outCount = 0;

        // items is already filtered by date
        items.forEach(item => {
            // Match by ID or Name
            const itemProductId = item.productId;
            const itemNormalizedName = normalizeTerm(item.name);

            // Loose equality for ID (string vs number)
            const isMatch = (itemProductId == pid) || (itemNormalizedName === pname);

            if (isMatch) {
                const qty = parseInt(item.quantity || 0);
                if (item.type === 'IN') {
                    inCount += qty;
                } else if (item.type === 'OUT') {
                    outCount += qty;
                }
            }
        });

        return {
            productId: pid,
            name: pname,
            category: pcategory,
            inCount,
            outCount
        };
    });

    // Sorting not strictly needed if we map over PRODUCTS which is already sorted, 
    // but if we want to ensure order or if PRODUCTS order changes, we can keep it simple.
    // Since we map PRODUCTS directly, the order is preserved as per PRODUCTS list.
    const sortedAggregated = aggregated;

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                <AlertCircle className="mx-auto mb-2" />
                {error}
                <button onClick={fetchData} className="mt-4 bg-gray-200 px-4 py-2 rounded">再試行</button>
            </div>
        );
    }

    return (
        <div className="pb-24 p-4 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">在庫集計</h1>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-8 pr-2 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Total Outbound */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-xl mb-8 text-center transform transition-transform hover:scale-[1.02]">
                <div className="text-sm font-medium opacity-90 mb-2">本日の総合計出庫数</div>
                <div className="text-5xl font-bold tracking-tight">
                    {totalOutbound}
                    <span className="text-xl ml-2 font-normal opacity-80">個</span>
                </div>
                <div className="text-xs mt-2 opacity-75">※サンプル出庫を含む</div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedAggregated.map((data, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-colors hover:bg-gray-50">
                            <div>
                                <div className="font-bold text-lg text-gray-800">{data.name}</div>
                                <div className="text-xs text-gray-400">{data.category}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                {data.inCount > 0 && (
                                    <div className="text-right">
                                        <div className="text-[10px] text-green-500 font-bold">入庫</div>
                                        <div className="text-lg font-bold text-green-600">{data.inCount}</div>
                                    </div>
                                )}
                                <div className="bg-red-50 px-4 py-2 rounded-lg text-center min-w-[70px]">
                                    <div className="text-[10px] text-red-500 font-bold mb-0.5">出庫</div>
                                    <div className="text-xl font-bold text-red-700 leading-none">{data.outCount}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Always show list, empty state handled by showing 0s */}
                </div>
            )}
        </div>
    );
}
