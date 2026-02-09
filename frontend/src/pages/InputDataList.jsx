import React, { useEffect, useState } from 'react';
import { Check, Loader2, Trash2, Calendar } from 'lucide-react';
import { storage } from '../utils/storage';

export default function InputDataList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = () => {
        setLoading(true);
        try {
            const data = storage.getItems();

            // 日付でフィルタリング
            const filtered = data.filter(item => {
                if (!item.date) return false;
                const itemDate = new Date(item.date).toISOString().split('T')[0];
                return itemDate === selectedDate;
            });

            // 時間の降順でソート（新しい順）
            const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            setItems(sorted);
        } catch (error) {
            console.error('データ取得エラー', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (uuid) => {
        if (window.confirm('この履歴を削除しますか？')) {
            storage.deleteItem(uuid);
            fetchData(); // 再取得
        }
    };

    // 時間のみフォーマット (HH:mm)
    const formatTime = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <div className="pb-24 p-4 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">入力データ一覧</h1>
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
                    <button
                        onClick={fetchData}
                        className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-600 hover:bg-gray-50 shadown-sm"
                    >
                        更新
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                    <p>データがありません</p>
                    <p className="text-xs mt-2">{selectedDate}</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white">
                    <table className="w-full text-sm text-left layer-table">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-3 py-3 w-16 whitespace-nowrap">種別</th>
                                <th className="px-3 py-3 whitespace-nowrap">BOSS / Staff</th>
                                <th className="px-3 py-3">注文内容</th>
                                <th className="px-2 py-3 text-center whitespace-nowrap">社販</th>
                                <th className="px-2 py-3 text-center whitespace-nowrap">BOSS<br />Check</th>
                                <th className="px-2 py-3 text-center">削除</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {items.map((item, index) => {
                                // BOSS IDが変わるタイミングで太線を入れる
                                const isNewGroup = index > 0 && items[index - 1].bossId !== item.bossId;
                                const borderClass = isNewGroup ? 'border-t-4 border-gray-400' : '';

                                return (
                                    <tr key={index} className={`hover:bg-gray-50 ${borderClass}`}>
                                        {/* 種別 & 時間 */}
                                        <td className="px-3 py-3 whitespace-nowrap align-top">
                                            <div className={`text-xs font-bold px-1.5 py-0.5 rounded w-fit mb-1 ${item.type === 'OUT' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                                }`}>
                                                {item.type === 'OUT' ? '出庫' : '入庫'}
                                            </div>
                                            <div className="text-xs text-gray-400 font-mono">
                                                {formatTime(item.date)}
                                            </div>
                                        </td>

                                        {/* BOSS ID / 担当者 */}
                                        <td className="px-3 py-3 whitespace-nowrap align-top">
                                            <div className="font-bold text-gray-800 text-lg">{item.bossId || '-'}</div>
                                            <div className="text-xs text-gray-500">{item.staff}</div>
                                        </td>

                                        {/* 注文内容 */}
                                        <td className="px-3 py-3 align-top">
                                            <div className="font-bold text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-400 mb-1">{item.fullName}</div>
                                            <div className="text-sm">
                                                <span className="font-bold">x {item.quantity}</span>
                                            </div>
                                        </td>

                                        {/* 社販チェック */}
                                        <td className="px-2 py-3 text-center align-top">
                                            {item.isStaffSale && (
                                                <div className="flex justify-center text-blue-600">
                                                    <Check size={20} strokeWidth={3} />
                                                </div>
                                            )}
                                        </td>

                                        {/* BOSSチェック */}
                                        <td className="px-2 py-3 text-center align-top">
                                            {item.isBossCheck && (
                                                <div className="flex justify-center text-orange-500">
                                                    <Check size={20} strokeWidth={3} />
                                                </div>
                                            )}
                                        </td>

                                        {/* 削除ボタン */}
                                        <td className="px-2 py-3 text-center align-top">
                                            <button
                                                onClick={() => handleDelete(item.uuid)}
                                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
