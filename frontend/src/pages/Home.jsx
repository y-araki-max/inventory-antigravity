import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageMinus, PackagePlus, List, BarChart3, Calculator } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    const menuItems = [
        { label: '出庫入力', path: '/outbound', icon: <PackageMinus size={32} />, color: 'bg-red-500' },
        { label: '入庫入力', path: '/inbound', icon: <PackagePlus size={32} />, color: 'bg-green-500' },
        { label: 'データ一覧', path: '/list', icon: <List size={32} />, color: 'bg-blue-500' },
        { label: '集計', path: '/aggregation', icon: <BarChart3 size={32} />, color: 'bg-indigo-500' },
        { label: '在庫管理表', path: '/inventory', icon: <Calculator size={32} />, color: 'bg-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">在庫管理システム</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`${item.color} text-white p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95`}
                    >
                        {item.icon}
                        <span className="font-bold text-lg">{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8 text-xs text-gray-400">
                v2.0 Final Form
            </div>
        </div>
    );
}
