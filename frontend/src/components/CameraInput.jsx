import React, { useRef, useState } from 'react';
import { Camera, RefreshCw, Trash2 } from 'lucide-react';

export function CameraInput({ onImageCapture, label = '写真' }) {
    const [preview, setPreview] = useState(null);
    const inputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // ファイル読み込みとリサイズ処理
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // リサイズ用のキャンバス作成
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 最大サイズ設定 (例: 長辺800px)
                const YOUR_MAX_SIZE = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > YOUR_MAX_SIZE) {
                        height *= YOUR_MAX_SIZE / width;
                        width = YOUR_MAX_SIZE;
                    }
                } else {
                    if (height > YOUR_MAX_SIZE) {
                        width *= YOUR_MAX_SIZE / height;
                        height = YOUR_MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // 描画
                ctx.drawImage(img, 0, 0, width, height);

                // 圧縮してBase64取得 (JPEG, 品質0.7)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

                setPreview(dataUrl);
                onImageCapture(dataUrl);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleClear = () => {
        setPreview(null);
        onImageCapture(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-500">{label}</label>

            {!preview ? (
                <button
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center justify-center gap-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-500 hover:bg-gray-200 active:bg-gray-300 transition-colors h-32"
                >
                    <Camera size={24} />
                    <span className="font-bold">撮影 / 選択</span>
                </button>
            ) : (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                        onClick={handleClear}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            )}

            {/* 非表示のinput要素 */}
            <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                ref={inputRef}
                className="hidden"
            />
        </div>
    );
}
