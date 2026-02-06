import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Package, Truck, BarChart3 } from 'lucide-react';
import Outbound from './pages/Outbound';
import Inbound from './pages/Inbound';
import Aggregation from './pages/Aggregation';

// ナビゲーション用のボタン（画面下のメニュー）
function NavButton({ to, icon, label }) {
  const location = useLocation();
  // 今いるページなら色を変える
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center p-4 w-full h-full transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'
        }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-bold">{label}</span>
    </Link>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* 画面全体 */}
      <div className="flex flex-col h-screen bg-gray-50 text-gray-900">

        {/* メインエリア（ここに各ページが表示されます） */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Outbound />} />
            <Route path="/inbound" element={<Inbound />} />
            <Route path="/aggregation" element={<Aggregation />} />
          </Routes>
        </div>

        {/* 画面下のメニューバー */}
        <div className="h-20 bg-white border-t border-gray-200 flex justify-around items-center shrink-0 z-40 shadow-lg">
          <NavButton to="/" icon={<Package size={28} />} label="出庫入力" />
          <NavButton to="/inbound" icon={<Truck size={28} />} label="入庫入力" />
          <NavButton to="/aggregation" icon={<BarChart3 size={28} />} label="集計" />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
