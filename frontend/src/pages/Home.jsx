import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageMinus, PackagePlus, List, BarChart3, Calculator } from 'lucide-react';
import marutikun from '../assets/marutikun.png';

export default function Home() {
    const navigate = useNavigate();

    const menuItems = [
        { label: '出庫入力', path: '/outbound', icon: <PackageMinus size={32} />, color: 'bg-red-500 hover:bg-red-600' },
        { label: '入庫入力', path: '/inbound', icon: <PackagePlus size={32} />, color: 'bg-green-500 hover:bg-green-600' },
        { label: 'データ一覧', path: '/list', icon: <List size={32} />, color: 'bg-blue-500 hover:bg-blue-600' },
        { label: '集計', path: '/aggregation', icon: <BarChart3 size={32} />, color: 'bg-indigo-500 hover:bg-indigo-600' },
        { label: '在庫管理表', path: '/inventory', icon: <Calculator size={32} />, color: 'bg-orange-500 hover:bg-orange-600' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">

            {/* Header / Logo Section */}
            <div className="flex flex-col items-center mb-10">
                <img
                    src={marutikun}
                    alt="Marutikun"
                    className="h-24 w-auto mb-4 animate-bounce-slow object-contain"
                />
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight text-center">
                    在庫管理システム <span className="text-blue-600">Lotta</span>
                </h1>
                <p className="text-gray-500 mt-2 text-sm">Simple & Fast Inventory Management</p>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl px-4">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`${item.color} group relative overflow-hidden text-white p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 flex flex-col items-center justify-center gap-4`}
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                            {item.icon}
                        </div>
                        <span className="font-bold text-xl tracking-wide">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-12 text-xs text-gray-400 font-medium">
                v2.1 Lotta Edition
            </div>
        </div>
    );
}
