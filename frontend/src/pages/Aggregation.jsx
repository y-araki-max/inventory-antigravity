import React, { useEffect, useState } from 'react';
import { STAFF_LIST, CATEGORIES } from '../data';
import { Loader2, Calendar } from 'lucide-react';
import { storage } from '../utils/storage';

export default function Aggregation() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // 今日

    // 画面が表示されたときにデータを取得
    useEffect(() => {
        fetchData();
    }, [selectedDate]); // 日付が変わったら再取得

    const fetchData = async () => {
        setLoading(true);
        try {
            // localStorageから全データ取得
            const data = storage.getItems();

            // 選択した日付でフィルタリング
            const filtered = data.filter(item => {
                if (!item.date) return false;
                return new Date(item.date).toISOString().split('T')[0] === selectedDate;
            });

            setItems(filtered);
        } catch (error) {
            console.error('データ取得エラー', error);
        } finally {
            setLoading(false);
        }
    };

    // 総合計出庫数を計算
    const totalOutbound = items
        .filter(item => item.type === 'OUT')
        .reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);

    // データを集計（商品ごとに合計数を計算）
    const aggregated = items.reduce((acc, item) => {
        const key = item.productId || item.name; // IDがあればIDで、なければ名前でまとめる

        if (!acc[key]) {
            acc[key] = {
                name: item.name,
                category: item.category || 'その他', // カテゴリも保持（ソート用）
                inCount: 0,
                outCount: 0
            };
        }

        // 数量を加算
        const qty = parseInt(item.quantity || 0);
        if (item.type === 'IN') {
            acc[key].inCount += qty;
        } else if (item.type === 'OUT') {
            acc[key].outCount += qty;
        }

        return acc;
    }, {});

    // カテゴリ順 -> 名前順でソートして配列にする
    const sortedAggregated = Object.values(aggregated).sort((a, b) => {
        const catA = CATEGORIES.indexOf(a.category);
        const catB = CATEGORIES.indexOf(b.category);

        // カテゴリインデックスが見つからない場合は後ろへ
        const indexA = catA === -1 ? 999 : catA;
        const indexB = catB === -1 ? 999 : catB;

        if (indexA !== indexB) {
            return indexA - indexB;
        }
        return a.name.localeCompare(b.name);
    });

    return (
        <div className="pb-24 p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">在庫集計</h1>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="pl-8 pr-2 py-1 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <button onClick={fetchData} className="text-sm bg-gray-200 px-3 py-1 rounded-full text-gray-600">更新</button>
                </div>
            </div>

            {/* 総合計表示 */}
            <div className="bg-blue-600 text-white rounded-xl p-4 shadow-lg mb-6 text-center">
                <div className="text-sm opacity-90 mb-1">本日の総合計出庫数</div>
                <div className="text-4xl font-bold">{totalOutbound}<span className="text-lg ml-1 font-normal">個</span></div>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedAggregated.map((data, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div className="font-bold text-lg text-gray-800">{data.name}</div>
                            <div className="flex gap-3">
                                <div className="bg-red-50 px-4 py-2 rounded-lg text-center min-w-[80px]">
                                    <div className="text-[10px] text-red-500 font-bold mb-0.5">出庫</div>
                                    <div className="text-xl font-bold text-red-700 leading-none">{data.outCount}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {sortedAggregated.length === 0 && (
                        <p className="text-center text-gray-400 mt-10">この日のデータはありません</p>
                    )}
                </div>
            )}
        </div>
    );
}
