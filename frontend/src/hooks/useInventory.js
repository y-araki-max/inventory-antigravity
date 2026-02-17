import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS, CATEGORIES, normalizeTerm } from '../data';
import { storage } from '../utils/storage';
import { parseInventoryCSV } from '../utils/csvParser';
import multiCsv from '../assets/csv/multi_202601.csv?raw'; // Raw import

export const useInventory = () => {
    const [inventory, setInventory] = useState({});
    const [loading, setLoading] = useState(true);
    const location = useLocation(); // Re-fetch on navigation if needed

    useEffect(() => {
        loadInventory();
    }, [location.pathname]); // Reload when route changes (e.g. after entry)

    const loadInventory = () => {
        setLoading(true);
        try {
            // 1. Initial Data from CSV
            const csvData = parseInventoryCSV(multiCsv, PRODUCTS);

            // 2. Current App Data (App activity starts from Feb 1st 2026)
            // We assume CSV "Jan 31 Stock" is the baseline.
            // Any data in localStorage with date > 2026-02-01 should be processed.
            // However, safely, we can just process ALL localStorage data if we assume the CSV is the *start*.
            // But if the user entered Jan data in the app, it would be double counted if we aren't careful.
            // Let's assume the "App Operation Start" is Feb 1st.
            // We filter localStorage items to only include those after Jan 31st.
            const appItems = storage.getItems();
            const cutoffDate = new Date('2026-02-01T00:00:00');

            const newActivity = appItems.filter(item => {
                const d = new Date(item.date);
                return d >= cutoffDate;
            });

            // 3. Merge
            const todayStr = new Date().toISOString().split('T')[0];
            const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

            const calculatedInventory = {};

            PRODUCTS.forEach(product => {
                const pid = product.id;
                const csvItem = csvData[pid] || { initialStock: 0, history: [], averageOut: 0, reorderPoint: 0 };

                let currentStock = csvItem.initialStock;
                let todayOut = 0;
                let todaySample = 0;
                let monthOut = 0;

                // Process App Activity
                newActivity.forEach(item => {
                    const itemName = normalizeTerm(item.name);
                    // Match by ID (loose equality for string/number) OR Name
                    // Using normalized name allows matching "エネルギー" to "エナジー"
                    if (item.productId == pid || itemName === product.name) {
                        const qty = parseInt(item.quantity || 0);
                        const isOut = item.type === 'OUT';
                        const isSample = item.isSample;

                        if (isOut) {
                            currentStock -= qty;
                            // Check Today
                            if (item.date.startsWith(todayStr)) {
                                todayOut += qty;
                                if (isSample) todaySample += qty;
                            }
                            // Check Month
                            if (item.date.startsWith(currentMonthStr)) {
                                monthOut += qty;
                            }
                        } else {
                            // IN
                            currentStock += qty;
                        }
                    }
                });

                // --- Daily History Calculation (Feb 2026) ---
                // We generate a list for the entire current month (or reasonable range)
                const dailyHistory = [];
                // Start from Feb 1st
                const startDate = new Date('2026-02-01T00:00:00');
                // End at today? Or end of month? Let's go to Today + 1 or End of Feb.
                // For "History", usually up to "Today".
                // But user might want to see the whole month grid. Let's do the whole month of Feb 2026 for now, or dynamic.
                // Let's rely on Today's month.
                const now = new Date();
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

                // If we are strictly in Feb 2026 mode as per user context:
                const targetYear = 2026;
                const targetMonth = 1; // 0-indexed (Feb)
                const daysInFeb = new Date(targetYear, targetMonth + 1, 0).getDate();

                let runningStock = csvItem.initialStock;

                for (let d = 1; d <= daysInFeb; d++) {
                    const dateObj = new Date(targetYear, targetMonth, d);
                    const dateStr = dateObj.toISOString().split('T')[0];

                    // Filter items for this day
                    const dayItems = newActivity.filter(item => {
                        return item.date.startsWith(dateStr) &&
                            // Match Product
                            (item.productId == pid || normalizeTerm(item.name) === product.name);
                    });

                    let dayIn = 0;
                    let dayOut = 0;     // Sales (Non-sample)
                    let daySample = 0;  // Samples

                    dayItems.forEach(item => {
                        const qty = parseInt(item.quantity || 0);
                        if (item.type === 'IN') {
                            dayIn += qty;
                        } else if (item.type === 'OUT') {
                            if (item.isSample) {
                                daySample += qty;
                            } else {
                                dayOut += qty;
                            }
                        }
                    });

                    // Update Stock
                    // Stock = Start + In - Out - Sample
                    runningStock = runningStock + dayIn - dayOut - daySample;

                    dailyHistory.push({
                        date: dateStr,
                        dateObj: dateObj,
                        in: dayIn,
                        out: dayOut,
                        sample: daySample,
                        stock: runningStock
                    });
                }

                calculatedInventory[pid] = {
                    ...csvItem, // CSV priority low
                    ...product, // Master Data priority high (Name, Category, ID)
                    currentStock,
                    todayOut,
                    todaySample,
                    monthOut,
                    dailyHistory
                };
            });

            setInventory(calculatedInventory);
        } catch (error) {
            console.error("Failed to load inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    return { inventory, loading, refresh: loadInventory };
};
