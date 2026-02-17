import { normalizeTerm } from './frontend/src/data.js';

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: function (key) { return this.store[key] || null; },
    setItem: function (key, value) { this.store[key] = value.toString(); },
    clear: function () { this.store = {}; }
};
global.localStorage = localStorageMock;

// Mock storage util
const storage = {
    getItems: () => {
        const json = localStorage.getItem('inventory_history');
        return json ? JSON.parse(json) : [];
    }
};

// Simulation Data (Old Terms)
const oldData = [
    { uuid: '1', name: '大ボトル', category: 'マルチ', type: 'IN', quantity: 10, date: '2026-02-01' },
    { uuid: '2', name: 'エネルギー', category: '特別作戦', type: 'OUT', quantity: 5, date: '2026-02-02' }, // Needs migration
    { uuid: '3', name: '競合商品A', category: '競合商品', type: 'OUT', quantity: 2, date: '2026-02-03' }   // Needs migration
];

console.log('--- BEFORE MIGRATION ---');
console.log(JSON.stringify(oldData, null, 2));
localStorage.setItem('inventory_history', JSON.stringify(oldData));

// Migration Logic (Copied from migration.js for testing context)
const runMigration = () => {
    console.log('Starting data migration...');
    const items = storage.getItems();
    let changed = false;

    const newItems = items.map(item => {
        let newItem = { ...item };
        let isItemChanged = false;

        const normalizedName = normalizeTerm(newItem.name);
        if (newItem.name !== normalizedName) {
            console.log(`Migrating Name: ${newItem.name} -> ${normalizedName}`);
            newItem.name = normalizedName;
            isItemChanged = true;
        }

        if (newItem.category) {
            const normalizedCat = normalizeTerm(newItem.category);
            if (newItem.category !== normalizedCat) {
                console.log(`Migrating Category: ${newItem.category} -> ${normalizedCat}`);
                newItem.category = normalizedCat;
                isItemChanged = true;
            }
        }

        if (isItemChanged) changed = true;
        return newItem;
    });

    if (changed) {
        localStorage.setItem('inventory_history', JSON.stringify(newItems));
        console.log('Migration completed: entries updated.');
    } else {
        console.log('Migration completed: no changes needed.');
    }
};

runMigration();

console.log('--- AFTER MIGRATION ---');
const newData = JSON.parse(localStorage.getItem('inventory_history'));
console.log(JSON.stringify(newData, null, 2));

// Validation
const failed = newData.find(d => d.name === 'エネルギー' || d.category === '特別作戦' || d.category === '競合商品');
if (!failed) {
    console.log('SUCCESS: All terms validated as migrated.');
} else {
    console.error('FAILURE: Old terms still exist.');
    process.exit(1);
}
