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
            <div className="flex flex-col items-center mb-8">
                <img
                    src={marutikun}
                    alt="Marutikun"
                    className="h-24 w-auto mb-2 animate-bounce-slow object-contain"
                />
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-500 tracking-wider mb-1">在庫管理システム</p>
                    <h1 className="text-5xl font-extrabold text-blue-600 tracking-tight leading-none">
                        Lotta
                    </h1>
                </div>
            </div>

            {/* Menu Grid - 2-2-1 Layout */}
            <div className="w-full max-w-md px-4 flex flex-col gap-4">

                {/* Row 1: Outbound & Inbound */}
                <div className="grid grid-cols-2 gap-4">
                    <MenuButton item={menuItems[0]} navigate={navigate} />
                    <MenuButton item={menuItems[1]} navigate={navigate} />
                </div>

                {/* Row 2: Inventory & Aggregation */}
                <div className="grid grid-cols-2 gap-4">
                    <MenuButton item={menuItems[4]} navigate={navigate} />
                    <MenuButton item={menuItems[3]} navigate={navigate} />
                </div>

                {/* Row 3: Data List (Centered) */}
                <div className="grid grid-cols-1 gap-4">
                    <MenuButton item={menuItems[2]} navigate={navigate} />
                </div>

            </div>

            {/* Footer */}
            <div className="mt-12 text-xs text-gray-400 font-medium">
                v2.1 Lotta Edition
            </div>
        </div>
    );
}

function MenuButton({ item, navigate }) {
    return (
        <button
            onClick={() => navigate(item.path)}
            className={`${item.color} group relative overflow-hidden text-white p-4 h-32 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 flex flex-col items-center justify-center gap-2`}
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                {React.cloneElement(item.icon, { size: 28 })}
            </div>
            <span className="font-bold text-lg tracking-wide">{item.label}</span>
        </button>
    );
}
