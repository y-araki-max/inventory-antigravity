import React, { useEffect, useState } from 'react';
import { Check, Loader2, Trash2 } from 'lucide-react';
import { storage } from '../utils/storage';

export default function InputDataList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        try {
            const data = storage.getItems();
            // 日付の降順でソート（新しい順）
            const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
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

    // 日付フォーマット (YYYY/MM/DD HH:mm)
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    return (
        <div className="pb-24 p-4 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800">入力データ一覧</h1>
                <button
                    onClick={fetchData}
                    className="text-sm bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-600 hover:bg-gray-50 shadown-sm"
                >
                    更新
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">データがありません</div>
            ) : (
                <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white">
                    <table className="w-full text-sm text-left layer-table">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-3 py-3 whitespace-nowrap">日付</th>
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
                                        {/* 日付 */}
                                        <td className="px-3 py-3 whitespace-nowrap text-gray-500 align-top">
                                            <div className="font-bold text-gray-900">{formatDate(item.date).split(' ')[0]}</div>
                                            <div className="text-xs">{formatDate(item.date).split(' ')[1]}</div>
                                            <div className={`text-xs font-bold mt-1 px-1.5 py-0.5 rounded w-fit ${item.type === 'OUT' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                                }`}>
                                                {item.type === 'OUT' ? '出庫' : '入庫'}
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
