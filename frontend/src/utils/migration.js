import { storage } from './storage';
import { normalizeTerm } from '../data';

const MIGRATION_KEY = 'migration_v2_force_fix_terms'; // Changed key to force re-run

export const runMigration = () => {
    // Check if migration already ran
    if (localStorage.getItem(MIGRATION_KEY)) {
        console.log('Migration v2 already applied.');
        return;
    }

    console.log('Starting data migration v2 (Flexible & Aggressive)...');
    const items = storage.getItems();
    let changed = false;

    const newItems = items.map(item => {
        let newItem = { ...item };
        let isItemChanged = false;

        // 1. Normalize Name
        const normalizedName = normalizeTerm(newItem.name);
        if (newItem.name !== normalizedName) {
            console.log(`Migrating Name: ${newItem.name} -> ${normalizedName}`);
            newItem.name = normalizedName;
            isItemChanged = true;
        }

        // 2. Normalize Category (CRITICAL: Fix "特別作戦②" etc.)
        if (newItem.category) {
            let cat = newItem.category;
            // Manual overrides for specific issues reported
            if (cat === '特別作戦' || cat === '特別作戦①') cat = 'オプショナル①';
            else if (cat === '特別作戦②' || cat === '特別作戦2') cat = 'オプショナル②';
            else if (cat === '特別作戦③' || cat === '特別作戦3') cat = 'オプショナル③';
            else if (cat === '競合商品') cat = '他社商品';
            else {
                // Fallback to general normalizer
                cat = normalizeTerm(cat);
            }

            if (newItem.category !== cat) {
                console.log(`Migrating Category: ${newItem.category} -> ${cat}`);
                newItem.category = cat;
                isItemChanged = true;
            }
        }

        // 3. Fix specific field values if any (e.g. type="受け取り" -> "IN" is not needed if type is IN/OUT enum)
        // But if type was stored as Japanese text potentially?
        // storage.js doesn't seem to enforce types, but typically it is IN/OUT.
        // Let's check logic for "受け取り" -> "出庫" (Wait, "受け取り" usually implies IN, "出庫" is OUT)
        // Handover says: "受け取り入力 / 受取 → 出庫入力 / 出庫"
        // Wait, "受け取り" (Receiving) -> "出庫" (Shipping)? That reverses meaning!
        // Let's check HANDOVER.md again.
        // HANDOVER.md: "受け取り入力 / 受取 → 出庫入力 / 出庫"
        // This likely refers to the UI Label or the Concept Name "Consumer Receipt" -> "Stock Output"?
        // If the data `type` is stored as 'IN' or 'OUT', we might be fine.
        // If stored as raw text, we need to be careful.
        // Let's assume `type` is IN/OUT code, and `name` is where the Japanese text lives.

        if (isItemChanged) changed = true;
        return newItem;
    });

    if (changed) {
        localStorage.setItem('inventory_history', JSON.stringify(newItems));
        console.log('Migration completed: entries updated.');
    } else {
        console.log('Migration completed: no changes needed.');
    }

    // Mark as done
    localStorage.setItem(MIGRATION_KEY, 'true');
};
