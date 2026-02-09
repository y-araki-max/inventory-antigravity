const STORAGE_KEY = 'inventory_history';

export const storage = {
    // データを保存（既存のリストに追加）
    saveItem: (item) => {
        const items = storage.getItems();
        // ユニークIDがない場合は付与
        if (!item.uuid) {
            item.uuid = crypto.randomUUID();
        }
        items.push(item);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    },

    // データを全件取得
    getItems: () => {
        const json = localStorage.getItem(STORAGE_KEY);
        try {
            return json ? JSON.parse(json) : [];
        } catch (e) {
            console.error('localStorage parse error', e);
            return [];
        }
    },

    // 指定したUUIDのデータを削除
    deleteItem: (uuid) => {
        const items = storage.getItems();
        const newItems = items.filter(item => item.uuid !== uuid);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    },

    // 全削除
    clearItems: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
