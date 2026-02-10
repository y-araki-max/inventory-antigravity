import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Package, Truck, BarChart3, ClipboardList, Home as HomeIcon, Calculator } from 'lucide-react';
import Home from './pages/Home';
import Outbound from './pages/Outbound';
import Inbound from './pages/Inbound';
import Aggregation from './pages/Aggregation';
import InputDataList from './pages/InputDataList';
import InventoryTable from './pages/InventoryTable';

// ナビゲーション用のボタン（画面下のメニュー）
function NavButton({ to, icon, label }) {
  const location = useLocation();
  // 今いるページなら色を変える
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center p-2 w-full h-full transition-colors ${isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'
        }`}
    >
      <div className="mb-0.5">{icon}</div>
      <span className="text-[10px] font-bold">{label}</span>
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
            <Route path="/" element={<Home />} />
            <Route path="/outbound" element={<Outbound />} />
            <Route path="/inbound" element={<Inbound />} />
            <Route path="/list" element={<InputDataList />} />
            <Route path="/aggregation" element={<Aggregation />} />
            <Route path="/inventory" element={<InventoryTable />} />
          </Routes>
        </div>

        {/* 画面下のメニューバー */}
        <div className="h-16 bg-white border-t border-gray-200 flex justify-around items-center shrink-0 z-40 shadow-lg safe-area-bottom">
          <NavButton to="/" icon={<HomeIcon size={24} />} label="ホーム" />
          <NavButton to="/outbound" icon={<Package size={24} />} label="出庫" />
          <NavButton to="/inbound" icon={<Truck size={24} />} label="入庫" />
          <NavButton to="/inventory" icon={<Calculator size={24} />} label="在庫表" />
          <NavButton to="/aggregation" icon={<BarChart3 size={24} />} label="集計" />
          <NavButton to="/list" icon={<ClipboardList size={24} />} label="一覧" />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
