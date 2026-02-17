import { storage } from './storage';
import { normalizeTerm } from '../data';

const MIGRATION_KEY = 'migration_v3_strict_fix'; // Changed key to force re-run again

export const runMigration = () => {
    // Check if migration already ran
    if (localStorage.getItem(MIGRATION_KEY)) {
        console.log('Migration v3 already applied.');
        return;
    }

    console.log('Starting data migration v3 (Strict & Consolidating)...');
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

        // 2. Normalize Category (CRITICAL: Consolidate Optionals)
        if (newItem.category) {
            let cat = newItem.category;

            // Force strict category mapping
            // Merge "Optional 1,2,3" -> "Optional"
            if (cat.includes('特別作戦') || cat.includes('オプショナル')) {
                cat = 'オプショナル';
            }
            if (cat === '競合商品') cat = '他社商品';
            if (cat === 'その他2丹青') cat = 'その他2';

            // Catch-all via normalizeTerm just in case
            const normCat = normalizeTerm(cat);
            if (cat !== normCat) cat = normCat;

            if (newItem.category !== cat) {
                console.log(`Migrating Category: ${newItem.category} -> ${cat}`);
                newItem.category = cat;
                isItemChanged = true;
            }
        }

        // 3. Normalize Type / Comments
        // If there are any fields that might contain "受け取り" etc.

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
