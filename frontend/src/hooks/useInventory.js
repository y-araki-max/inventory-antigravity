import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS, CATEGORIES, normalizeTerm } from '../data';
import * as storage from '../utils/storage';
import { parseInventoryCSV } from '../utils/csvParser';
import multiCsv from '../assets/csv/multi_202601.csv?raw'; // Raw import

export const useInventory = () => {
    const [inventory, setInventory] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [memos, setMemos] = useState({});

    // Time Machine State (Default: Current Month)
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth() + 1); // 1-12

    useEffect(() => {
        loadInventory();
        // eslint-disable-next-line
    }, [location.pathname, viewYear, viewMonth]); // Reload when view changes

    const loadInventory = () => {
        setLoading(true);
        try {
            // 1. Initial Data
            const csvData = parseInventoryCSV(multiCsv, PRODUCTS);
            const appItems = storage.getItems(); // This returns Transaction History (Array)
            const savedMemos = storage.getMemos();
            setMemos(savedMemos);

            // Filter New Activity? 
            // In v9, we might as well use ALL activity since 2026-02-01.
            // But beware: storage keys rotated, so `appItems` starts empty.
            // If empty, `newActivity` is empty.
            // If using v9.1 keys, `appItems` is empty.

            const cutoffDate = new Date('2026-02-01T00:00:00');
            const newActivity = appItems.filter(item => new Date(item.date) >= cutoffDate);

            // 3. Merge & Calculate (Time Machine Aware)
            const calculatedInventory = {};

            PRODUCTS.forEach(product => {
                const pid = product.id;
                const csvItem = csvData[pid] || { initialStock: 0 };

                // Base Stock (Jan End)
                const baseStock = parseInt(csvItem.initialStock || 0);

                // Calculate Stock AT END OF viewMonth
                // Logic: Base + (All activity up to End of viewMonth)

                // Define Time Boundaries for "Current Stock" Display
                // End of View Month
                const viewMonthEnd = new Date(viewYear, viewMonth, 0, 23, 59, 59, 999); // Last day of viewMonth

                let currentStock = baseStock;
                let lots = []; // Array to store unique lots

                // Process Activity for "Current Stock" (Up to View Month End)
                newActivity.forEach(item => {
                    const itemDate = new Date(item.date);
                    if (itemDate > viewMonthEnd) return; // Ignore future relative to view

                    // Match Logic
                    const isMatch = (item.productId == pid) || (normalizeTerm(item.name) === product.name);
                    if (isMatch) {
                        const qty = parseInt(item.quantity || 0);
                        const type = item.type;

                        if (type === 'OUT' || type === '出庫入力') {
                            currentStock -= qty;
                        } else if (type === 'IN') {
                            currentStock += qty;
                            if (item.lot && !lots.includes(item.lot)) {
                                lots.push(item.lot);
                            }
                        } else if (type === 'ADJUST') {
                            currentStock += qty;
                        }
                    }
                });

                if (isNaN(currentStock)) currentStock = 0;

                // Lot Sorting: Newest First
                // Since we pushed in order of appearance (usually chronological), reverse gives Newest First.
                const displayLots = [...lots].reverse();

                // Calculate Daily History for the VIEW MONTH
                const dailyHistory = calculateDailyHistory(
                    newActivity,
                    pid,
                    product,
                    baseStock, // Pass Base to calculate rolling stock correctly
                    viewYear,
                    viewMonth
                );

                calculatedInventory[pid] = {
                    ...csvItem,
                    ...product,
                    currentStock, // This is End-of-View-Month Stock
                    latestLot: displayLots.length > 0 ? displayLots[0] : '',
                    lots: displayLots,
                    memo: savedMemos[pid] || '',
                    dailyHistory: dailyHistory
                };
            });

            setInventory(calculatedInventory);
        } catch (error) {
            console.error("Failed to load inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper: Calculate Daily History for Specific Month
    const calculateDailyHistory = (activity, pid, product, initialStock, year, month) => { // month is 1-12
        const history = [];
        // Get number of days in the month. 
        // new Date(year, month, 0) returns the last day of the *previous* month if month is 0-indexed?
        // No, standard JS: new Date(2026, 2, 0) -> March 0th = Feb 28th. (Month 2 is March).
        // Here `month` param is 1-12.
        // So new Date(year, month, 0) where month is 2 (Feb) -> new Date(2026, 2, 0) -> Feb 28. Correct.
        const daysInMonth = new Date(year, month, 0).getDate();

        // We need "Stock at Start of Month" to run the daily loop
        const monthStart = new Date(year, month - 1, 1); // 1st of View Month (Month 0-11)

        let runningStock = initialStock;

        // Apply activity BEFORE this month to getting Start Stock
        activity.forEach(item => {
            const itemDate = new Date(item.date);
            if (itemDate < monthStart) {
                const isMatch = (item.productId == pid) || (normalizeTerm(item.name) === product.name);
                if (isMatch) {
                    const qty = parseInt(item.quantity || 0);
                    if (item.type === 'IN' || item.type === 'ADJUST') {
                        runningStock += qty;
                    } else if (item.type === 'OUT' || item.type === '出庫入力') {
                        runningStock -= qty;
                    }
                }
            }
        });

        // Now Loop Days of View Month
        for (let d = 1; d <= daysInMonth; d++) {
            // Determine date string for matching: YYYY-MM-DD
            const monthStr = String(month).padStart(2, '0');
            const dayStr = String(d).padStart(2, '0');
            const dateStr = `${year}-${monthStr}-${dayStr}`;
            const dateObj = new Date(year, month - 1, d);

            // Filter items for strictly this day
            const dayItems = activity.filter(item => {
                // Assuming item.date is ISO string or YYYY-MM-DD
                return item.date.startsWith(dateStr) &&
                    ((item.productId == pid) || (normalizeTerm(item.name) === product.name));
            });

            let dayIn = 0;
            let dayOut = 0;
            let daySample = 0;
            let dayOutDetails = []; // Strict v13: Large Purchase Details

            dayItems.forEach(item => {
                const qty = parseInt(item.quantity || 0);
                if (item.type === 'IN' || item.type === 'ADJUST') {
                    if (item.type === 'ADJUST') {
                        if (qty >= 0) dayIn += qty;
                        else {
                            dayOut += Math.abs(qty);
                            // Adjust doesn't usually have bossId, but if so add it
                        }
                    } else {
                        dayIn += qty;
                    }
                } else if (item.type === 'OUT' || item.type === '出庫入力') {
                    if (item.isSample) {
                        daySample += qty;
                    } else {
                        dayOut += qty;
                        // Strict v13: Collect Details
                        dayOutDetails.push({
                            bossId: item.bossId || '不明',
                            quantity: qty,
                            uuid: item.uuid
                        });
                    }
                }
            });

            // Update Stock
            runningStock = runningStock + dayIn - dayOut - daySample;

            history.push({
                date: dateStr,
                dateObj: dateObj,
                in: dayIn,
                out: dayOut,
                outDetails: dayOutDetails, // Added for v13
                sample: daySample,
                stock: runningStock
            });
        }
        return history;
    };


    const updateMemo = (productId, text) => {
        storage.saveMemo(productId, text);
        loadInventory(); // Reload to reflect
    };

    const adjustStock = (productId, actualStock) => {
        const product = inventory[productId];
        if (!product) return;

        const current = product.currentStock;
        const diff = actualStock - current;

        if (diff === 0) return;

        // Save Adjustment Record
        const record = {
            type: 'ADJUST',
            productId: productId,
            name: product.name,
            quantity: diff,
            date: new Date().toISOString(),
            uuid: crypto.randomUUID()
        };

        storage.saveItem(record);
        loadInventory();
    };

    return {
        inventory,
        loading,
        refresh: loadInventory,
        updateMemo,
        adjustStock,
        viewYear, setViewYear,
        viewMonth, setViewMonth
    };
};
