import React, { useState, useEffect } from 'react';
import { CATEGORIES, PRODUCTS } from '../data';
import { MapPin, Edit2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export default function InventoryTable() {
    // -------------------------------------------------------------------------
    // STANDALONE STATE MANAGEMENT
    // -------------------------------------------------------------------------
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [viewYear, setViewYear] = useState(currentYear);
    const [viewMonth, setViewMonth] = useState(currentMonth);
    const [allTransactions, setAllTransactions] = useState([]); // Raw Data
    const [memos, setMemos] = useState({});

    // UI States
    const [openCategories, setOpenCategories] = useState({});
    const [expandedProducts, setExpandedProducts] = useState(new Set());
    const [adjustTarget, setAdjustTarget] = useState(null);
    const [adjustValue, setAdjustValue] = useState('');

    // -------------------------------------------------------------------------
    // 1. DATA LOADING (STRICT V23.0: inventory_history)
    // -------------------------------------------------------------------------
    useEffect(() => {
        // STRICT V23.0: Use 'inventory_history'
        const txRaw = localStorage.getItem('inventory_history');
        const txData = JSON.parse(txRaw || '[]');

        console.log("=== STRICT V26.0 (Real Fix) DATA LOAD ===");
        console.log("Key: inventory_history");
        console.log("Count:", txData.length);

        setAllTransactions(txData);

        const memoRaw = localStorage.getItem('inventory-memos');
        setMemos(JSON.parse(memoRaw || '{}'));
    }, [viewYear, viewMonth]);

    // -------------------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------------------

    // STRICT V23.0 Matcher
    const isProductMatch = (t, product) => {
        if (t.productId && String(t.productId) == String(product.id)) return true;
        if (t.name && t.name === product.name) return true;
        if (t.itemName && t.itemName === product.name) return true;
        return false;
    };

    // STRICT V26.0 (Real Fix): Final Lot Extraction Logic
    // User identified "lotNo" as the correct key.
    const getLotString = (t) => {
        // Priority: lotNo > lot > memo > lotNumber
        if (t.lotNo) return t.lotNo;
        if (t.lot) return t.lot;
        if (t.memo) return t.memo;
        if (t.lotNumber) return t.lotNumber;
        return '-';
    };

    // STRICT V26.0: Latest Lot Extraction
    const getStockContext = (product) => {
        let stock = 0;
        let latestLot = '-';
        let latestInDate = '';

        allTransactions.forEach(t => {
            if (!isProductMatch(t, product)) return;

            const qty = parseInt(t.quantity, 10) || 0;
            const type = (t.type || '').toUpperCase();

            if (type === 'IN' || type === 'ADJUST') {
                if (type === 'ADJUST') {
                    stock += qty;
                } else {
                    stock += qty;
                    // STRICT V26.0: Check for Latest Lot (IN)
                    if (type === 'IN') {
                        // Find the NEWEST date
                        const tDate = t.date || '';
                        if (tDate >= latestInDate) {
                            latestInDate = tDate;
                            latestLot = getLotString(t); // Uses lotNo
                        }
                    }
                }
            } else if (type === 'OUT' || type === 'SAMPLE' || type === '出庫入力') {
                stock -= qty;
            }
        });

        return { stock, latestLot };
    };

    const toggleCategory = (cat) => {
        setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

    const toggleProductCalendar = (id) => {
        setExpandedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleAdjustSubmit = () => {
        if (!adjustTarget || adjustValue === '') return;
        const val = parseInt(adjustValue);
        if (!isNaN(val)) {
            const record = {
                uuid: crypto.randomUUID(),
                productId: adjustTarget.id,
                name: adjustTarget.name,
                type: 'ADJUST',
                quantity: val - adjustTarget.currentStock,
                date: new Date().toISOString(),
                bossId: '在庫修正'
            };
            const newTxs = [...allTransactions, record];
            localStorage.setItem('inventory_history', JSON.stringify(newTxs));
            setAllTransactions(newTxs);
        }
        setAdjustTarget(null);
        setAdjustValue('');
    };

    const updateMemo = (id, val) => {
        const newMemos = { ...memos, [id]: val };
        setMemos(newMemos);
        localStorage.setItem('inventory-memos', JSON.stringify(newMemos));
    };

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    const groupedItems = CATEGORIES.reduce((acc, cat) => {
        acc[cat] = PRODUCTS.filter(p => p.category === cat);
        return acc;
    }, {});

    return (
        <div className="pb-32 p-2 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 ml-2 mr-2">
                <h1 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">在庫一覧 (Strict v26.0 Fix)</h1>
                <div className="flex items-center gap-2 bg-white p-2 rounded shadow-sm border border-gray-200">
                    <Calendar size={18} className="text-blue-600" />
                    <span className="text-xs font-bold text-gray-500">表示月:</span>
                    <select value={viewYear} onChange={(e) => setViewYear(Number(e.target.value))} className="font-bold text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer">
                        {Array.from({ length: 6 }, (_, i) => currentYear - 1 + i).map(y => <option key={y} value={y}>{y}年</option>)}
                    </select>
                    <select value={viewMonth} onChange={(e) => setViewMonth(Number(e.target.value))} className="font-bold text-lg text-blue-600 bg-transparent border-none focus:ring-0 cursor-pointer">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => <option key={m} value={m}>{m}月</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {CATEGORIES.map(category => {
                    const items = groupedItems[category] || [];
                    if (items.length === 0) return null;
                    const isOpen = openCategories[category];

                    return (
                        <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div onClick={() => toggleCategory(category)} className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors">
                                <h2 className="font-bold text-lg text-gray-800">{category}</h2>
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 shadow-sm">{items.length}</span>
                            </div>

                            {isOpen && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white">
                                    {items.map(product => {
                                        const { stock: currentStock, latestLot } = getStockContext(product);
                                        const rp = product.reorderPoint !== '-' ? parseInt(product.reorderPoint) : 0;
                                        const isLowStock = rp > 0 && currentStock <= rp;
                                        const isCalendarOpen = expandedProducts.has(product.id);
                                        const memo = memos[product.id] || '';

                                        return (
                                            <div key={product.id} className={`p-4 rounded-lg border-2 transition-all ${isLowStock ? 'border-red-100 bg-red-50/50' : 'border-gray-100 bg-white'}`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <button onClick={() => toggleProductCalendar(product.id)} className="text-left font-bold text-gray-800 text-lg leading-tight hover:text-blue-600 hover:underline decoration-2 underline-offset-2 flex items-center gap-1">
                                                            {product.name}
                                                            {isCalendarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </button>
                                                        <p className="text-[10px] text-gray-400 mt-1">{product.fullName}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-blue-600'}`}>
                                                            {currentStock.toLocaleString()}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400">現在在庫</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 text-xs mb-3 bg-gray-50 p-2 rounded border border-gray-100">
                                                    <div>
                                                        <span className="text-gray-400 block text-[10px]">最新ロット</span>
                                                        <span className="font-bold text-gray-700">{latestLot}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block text-[10px]">発注点</span>
                                                        <span className={`font-bold ${isLowStock ? 'text-red-500' : 'text-gray-700'}`}>
                                                            {product.reorderPoint || '-'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 block text-[10px]">平均出庫</span>
                                                        <span className="text-gray-700 font-medium">
                                                            {product.avgDailyOut || '-'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <textarea
                                                        className="w-full text-xs p-2 border border-yellow-200 rounded resize-none focus:border-yellow-400 focus:outline-none bg-yellow-50/50"
                                                        rows="2"
                                                        placeholder="メモ"
                                                        defaultValue={memo}
                                                        onBlur={(e) => updateMemo(product.id, e.target.value)}
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            setAdjustTarget({ id: product.id, name: product.name, currentStock });
                                                            setAdjustValue(currentStock);
                                                        }}
                                                        className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 border border-gray-200"
                                                    >
                                                        <Edit2 size={12} />
                                                        在庫数修正
                                                    </button>
                                                </div>

                                                {isCalendarOpen && (
                                                    <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 animate-in slide-in-from-top-2 duration-200">
                                                        <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                                                            <MapPin size={12} />
                                                            日次推移 ({viewYear}年{viewMonth}月)
                                                        </h4>
                                                        <div className="overflow-x-auto border border-gray-200 rounded bg-white max-h-60 overflow-y-auto">
                                                            <table className="w-full text-center text-xs whitespace-nowrap">
                                                                <thead className="bg-gray-100 text-gray-600 font-medium sticky top-0 z-10 shadow-sm">
                                                                    <tr>
                                                                        <th className="p-1 min-w-[30px] bg-gray-100">日</th>
                                                                        <th className="p-1 min-w-[30px] border-l border-gray-200 bg-gray-100">入</th>
                                                                        <th className="p-1 min-w-[30px] border-l border-gray-200 bg-gray-100">出</th>
                                                                        <th className="p-1 min-w-[30px] border-l border-gray-200 bg-gray-100">サ</th>
                                                                        <th className="p-1 min-w-[40px] border-l border-gray-200 bg-gray-100">在庫</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {(() => {
                                                                        // -----------------------------------------------------------------
                                                                        // STRICT V26.0 (Real Fix): Final Integration
                                                                        // -----------------------------------------------------------------
                                                                        let m = viewMonth;
                                                                        let y = viewYear;
                                                                        let daysInMonth = new Date(y, m, 0).getDate();

                                                                        const startOfMonthKey = `${y}-${String(m).padStart(2, '0')}-01`;
                                                                        const pTxs = allTransactions.filter(t => isProductMatch(t, product));

                                                                        // Calculate Start Stock
                                                                        let renderStock = 0;

                                                                        pTxs.forEach(t => {
                                                                            if (!t.date) return;
                                                                            const tDate = t.date;
                                                                            if (tDate < startOfMonthKey) {
                                                                                const qty = parseInt(t.quantity, 10) || 0;
                                                                                const type = (t.type || '').toUpperCase();
                                                                                if (type === 'IN' || type === 'ADJUST') renderStock += qty;
                                                                                else if (type === 'OUT' || type === 'SAMPLE' || type === '出庫入力') renderStock -= qty;
                                                                            }
                                                                        });

                                                                        return Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                                                                            const dStr = String(d).padStart(2, '0');
                                                                            const mStr = String(m).padStart(2, '0');
                                                                            const dayKey = `${y}-${mStr}-${dStr}`;

                                                                            // 2. Filter Transactions by Substring Match
                                                                            const dayTxs = pTxs.filter(t => {
                                                                                if (!t.date) return false;
                                                                                return t.date.substring(0, 10) === dayKey;
                                                                            });

                                                                            // 3. Sum (Inline)
                                                                            let dIn = 0, dOut = 0, dSample = 0;
                                                                            const bossDetails = [];
                                                                            const inboundDetails = [];

                                                                            dayTxs.forEach(t => {
                                                                                const qty = Number(t.quantity) || 0;
                                                                                const type = (t.type || '').toUpperCase();

                                                                                if (type === 'IN' || type === 'ADJUST') {
                                                                                    if (type === 'ADJUST') {
                                                                                        if (qty >= 0) dIn += qty;
                                                                                        else dOut += Math.abs(qty);
                                                                                    } else {
                                                                                        dIn += qty;
                                                                                        // STRICT V26.0 (Real Fix): Uses lotNo
                                                                                        const lotStr = getLotString(t);
                                                                                        inboundDetails.push(`${lotStr} (${qty})`);
                                                                                    }
                                                                                } else if (type === 'OUT' || type === '出庫入力') {
                                                                                    if (t.isSample) {
                                                                                        dSample += qty;
                                                                                    } else {
                                                                                        dOut += qty;
                                                                                        if (t.bossId) bossDetails.push(t.bossId);
                                                                                    }
                                                                                } else if (type === 'SAMPLE') {
                                                                                    dSample += qty;
                                                                                }
                                                                            });

                                                                            // 4. Update Stock
                                                                            renderStock = renderStock + dIn - dOut - dSample;

                                                                            // Styling
                                                                            const dateObj = new Date(y, m - 1, d);
                                                                            const dayOfWeek = dateObj.getDay();
                                                                            const isSat = dayOfWeek === 6;
                                                                            const isSun = dayOfWeek === 0;
                                                                            const rowClass = isSat ? 'bg-blue-50' : isSun ? 'bg-red-50' : (d % 2 === 0 ? 'bg-white' : 'bg-gray-50');
                                                                            const textClass = isSat ? 'text-blue-600 font-bold' : isSun ? 'text-red-600 font-bold' : 'text-gray-700 font-bold';

                                                                            // Click Handlers
                                                                            const handleBossClick = () => {
                                                                                alert(`【BOSS ID / お届け先】\n${bossDetails.length > 0 ? bossDetails.join('\n') : '詳細なし'}`);
                                                                            };
                                                                            const handleInboundClick = () => {
                                                                                alert(`【入庫詳細 / ロット】\n${inboundDetails.length > 0 ? inboundDetails.join('\n') : '詳細なし'}`);
                                                                            };

                                                                            return (
                                                                                <tr key={`${y}-${m}-${d}-${product.id}`} className={`${rowClass} border-b border-gray-100 last:border-0`}>
                                                                                    <td className={`p-1 text-center ${textClass}`}>{d}</td>

                                                                                    {/* IN (Click enabled for Lot Details) */}
                                                                                    <td
                                                                                        className="p-1 border-l border-gray-100 text-blue-600 font-medium cursor-pointer hover:bg-blue-50"
                                                                                        title={inboundDetails.join(', ')}
                                                                                        onClick={dIn > 0 ? handleInboundClick : undefined}
                                                                                    >
                                                                                        {dIn > 0 ? dIn : ''}
                                                                                    </td>

                                                                                    {/* OUT & BOSS INDICATOR */}
                                                                                    <td
                                                                                        className="p-1 border-l border-gray-100 text-gray-600 relative group cursor-pointer"
                                                                                        onClick={dOut >= 10 ? handleBossClick : undefined}
                                                                                    >
                                                                                        {dOut > 0 ? dOut : ''}

                                                                                        {/* Black Triangle for >= 10 */}
                                                                                        {dOut >= 10 && (
                                                                                            <div
                                                                                                className="absolute top-0 right-0 pointer-events-none"
                                                                                                style={{
                                                                                                    width: 0,
                                                                                                    height: 0,
                                                                                                    borderStyle: 'solid',
                                                                                                    borderWidth: '0 8px 8px 0',
                                                                                                    borderColor: 'transparent #000000 transparent transparent'
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    </td>

                                                                                    {/* SAMPLE */}
                                                                                    <td className="p-1 border-l border-gray-100 text-green-600">
                                                                                        {dSample > 0 ? dSample : ''}
                                                                                    </td>

                                                                                    {/* STOCK */}
                                                                                    <td className="p-1 border-l border-gray-100 font-bold text-gray-800">
                                                                                        {renderStock}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        });
                                                                    })()}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {adjustTarget && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
                        <h3 className="font-bold text-lg mb-1 text-gray-800">{adjustTarget.name}</h3>
                        <div className="flex gap-4 items-center mb-6 justify-center">
                            <input
                                type="number"
                                className="w-24 text-center text-3xl font-bold border-b-2 border-blue-500 focus:outline-none text-gray-800"
                                value={adjustValue}
                                onChange={(e) => setAdjustValue(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setAdjustTarget(null)} className="py-3 bg-gray-100 rounded-lg">キャンセル</button>
                            <button onClick={handleAdjustSubmit} className="py-3 text-white bg-blue-600 rounded-lg font-bold">修正確定</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
