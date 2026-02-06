import React, { useState } from 'react';

// 数字入力用のモーダル（ポップアップ画面）
export function NumPad({ isOpen, onClose, onConfirm, title }) {
    const [value, setValue] = useState('');

    // 閉じてるなら何も表示しない
    if (!isOpen) return null;

    // 数字ボタンを押したとき
    const handleNumClick = (num) => {
        setValue(prev => prev + num);
    };

    // 決定ボタン
    const handleConfirm = () => {
        if (value) {
            onConfirm(parseInt(value, 10)); // 文字を数字に変換して渡す
            setValue(''); // クリア
        }
    };

    // 閉じるボタン
    const handleClose = () => {
        setValue('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                {/* ヘッダー */}
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={handleClose} className="font-bold text-xl px-2">✕</button>
                </div>

                {/* 入力された数字表示エリア */}
                <div className="p-6 bg-gray-50 text-center border-b border-gray-200">
                    <div className="text-4xl font-bold text-gray-800 min-h-[3rem]">
                        {value || <span className="text-gray-300">0</span>}
                    </div>
                </div>

                {/* テンキーボタン */}
                <div className="p-4 grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleNumClick(num)}
                            className="h-16 bg-white text-blue-900 border border-blue-100 font-bold text-2xl rounded-xl hover:bg-blue-50 active:scale-95 shadow-sm"
                        >
                            {num}
                        </button>
                    ))}

                    {/* 0ボタン */}
                    <button
                        onClick={() => handleNumClick(0)}
                        className="col-start-2 h-16 bg-white text-blue-900 border border-blue-100 font-bold text-2xl rounded-xl hover:bg-blue-50 active:scale-95 shadow-sm"
                    >
                        0
                    </button>

                    {/* OKボタン */}
                    <button
                        onClick={handleConfirm}
                        className="col-start-3 bg-blue-600 text-white rounded-xl font-bold text-xl hover:bg-blue-700 active:scale-95 shadow-md"
                    >
                        OK
                    </button>

                    {/* クリアボタン */}
                    <button
                        onClick={() => setValue('')}
                        className="col-start-1 row-start-4 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 active:scale-95 h-16"
                    >
                        クリア
                    </button>
                </div>
            </div>
        </div>
    );
}
