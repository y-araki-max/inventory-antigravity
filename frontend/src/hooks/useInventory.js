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
    const [memos, setMemos] = useState({});

    useEffect(() => {
        loadInventory();
    }, [location.pathname]);

    const loadInventory = () => {
        setLoading(true);
        try {
            // 1. Initial Data
            const csvData = parseInventoryCSV(multiCsv, PRODUCTS);
            const appItems = storage.getItems();
            const savedMemos = storage.getMemos();
            setMemos(savedMemos);

            const cutoffDate = new Date('2026-02-01T00:00:00');
            const newActivity = appItems.filter(item => new Date(item.date) >= cutoffDate);

            // 3. Merge
            const todayStr = new Date().toISOString().split('T')[0];
            const currentMonthStr = todayStr.substring(0, 7);

            const calculatedInventory = {};

            PRODUCTS.forEach(product => {
                const pid = product.id;
                const csvItem = csvData[pid] || { initialStock: 0 };

                let currentStock = csvItem.initialStock;
                let todayOut = 0;
                let todaySample = 0;
                let monthOut = 0;
                let latestLot = ''; // New: Track Lot

                // Process History
                newActivity.forEach(item => {
                    // Match Logic
                    const isMatch = (item.productId == pid) || (normalizeTerm(item.name) === product.name);

                    if (isMatch) {
                        const qty = parseInt(item.quantity || 0);
                        const type = item.type; // IN, OUT, ADJUST

                        if (type === 'OUT') {
                            currentStock -= qty;
                            if (item.date.startsWith(todayStr)) {
                                todayOut += qty;
                                if (item.isSample) todaySample += qty;
                            }
                            if (item.date.startsWith(currentMonthStr)) monthOut += qty;
                        } else if (type === 'IN') {
                            currentStock += qty;
                            // Capture Lot from IN records
                            if (item.lot) latestLot = item.lot;
                        } else if (type === 'ADJUST') {
                            // Manual Adjustment (Difference is stored in quantity)
                            // If quantity is positive, we add (found more).
                            // If negative, we subtract (lost/consumed).
                            currentStock += qty;
                        } else if (type === '出庫入力') {
                            // Legacy support just in case
                            currentStock -= qty;
                        }
                    }
                });

                // Safety: Validation to prevent NaN
                if (isNaN(currentStock)) currentStock = 0;

                calculatedInventory[pid] = {
                    ...csvItem,
                    ...product,
                    currentStock,
                    todayOut,
                    todaySample,
                    monthOut,
                    latestLot,
                    memo: savedMemos[pid] || '',
                    dailyHistory: [] // v7 simplification: Grid view doesn't imply daily graph needed immediately, staying safe.
                };
            });

            setInventory(calculatedInventory);
        } catch (error) {
            console.error("Failed to load inventory:", error);
        } finally {
            setLoading(false);
        }
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

    return { inventory, loading, refresh: loadInventory, updateMemo, adjustStock };
};
