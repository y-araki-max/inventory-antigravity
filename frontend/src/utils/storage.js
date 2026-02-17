const STORAGE_KEY = 'inventory_history';
const MEMO_KEY = 'inventory_memos';

export const storage = {
    // --- History (IN/OUT/ADJUST) ---
    saveItem: (item) => {
        const items = storage.getItems();
        if (!item.uuid) {
            item.uuid = crypto.randomUUID();
        }
        items.push(item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    },

    getItems: () => {
        const json = localStorage.getItem(STORAGE_KEY);
        try {
            return json ? JSON.parse(json) : [];
        } catch (e) {
            console.error('localStorage parse error', e);
            return [];
        }
    },

    deleteItem: (uuid) => {
        const items = storage.getItems();
        const newItems = items.filter(item => item.uuid !== uuid);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    },

    clearItems: () => {
        localStorage.removeItem(STORAGE_KEY);
    },

    // --- Memos (Product ID -> Text) ---
    saveMemo: (productId, text) => {
        const memos = storage.getMemos();
        memos[productId] = text;
        localStorage.setItem(MEMO_KEY, JSON.stringify(memos));
    },

    getMemos: () => {
        const json = localStorage.getItem(MEMO_KEY);
        try {
            return json ? JSON.parse(json) : {};
        } catch (e) {
            return {};
        }
    }
};
