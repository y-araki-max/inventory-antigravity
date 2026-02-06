import React from 'react';

// 共通のデザインのボタン
// variant: 色の種類 (primary=青, secondary=白, danger=赤, outline=枠線のみ)
export function BigButton({ children, onClick, variant = 'primary', className = '' }) {

    // 色の設定
    const colors = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
        secondary: "bg-white text-gray-800 border-2 border-gray-200 hover:bg-gray-50 active:bg-gray-100",
        danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
        outline: "bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100"
    };

    return (
        <button
            onClick={onClick}
            className={`
        w-full p-4 rounded-xl font-bold text-lg shadow-sm transition-all active:scale-95
        ${colors[variant]}
        ${className}
      `}
        >
            {children}
        </button>
    );
}
