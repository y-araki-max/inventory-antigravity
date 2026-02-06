import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Aggregation() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // 画面が表示されたときにデータを取得
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/items');
            setItems(res.data);
        } catch (error) {
            console.error('データ取得エラー', error);
        } finally {
            setLoading(false);
        }
    };

    // データを集計（商品ごとに合計数を計算）
    const aggregated = items.reduce((acc, item) => {
        const key = item.productId || item.name; // IDがあればIDで、なければ名前でまとめる
        if (!acc[key]) {
            acc[key] = {
                name: item.name,
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

    return (
        <div className="pb-24 p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold">在庫集計</h1>
                <button onClick={fetchData} className="text-sm bg-gray-200 px-3 py-1 rounded-full text-gray-600">更新</button>
            </div>

            {loading ? (
                <p>読み込み中...</p>
            ) : (
                <div className="space-y-3">
                    {Object.values(aggregated).map((data, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="font-bold text-lg mb-2">{data.name}</div>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-green-50 p-2 rounded text-center">
                                    <div className="text-xs text-green-600 font-bold">入庫計</div>
                                    <div className="text-xl font-bold text-green-800">{data.inCount}</div>
                                </div>
                                <div className="flex-1 bg-red-50 p-2 rounded text-center">
                                    <div className="text-xs text-red-600 font-bold">出庫計</div>
                                    <div className="text-xl font-bold text-red-800">{data.outCount}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <p className="text-center text-gray-400 mt-10">データがまだありません</p>
                    )}
                </div>
            )}
        </div>
    );
}
