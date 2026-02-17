import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong.</h2>
                    <p className="mb-4 text-gray-600">
                        アプリケーションにエラーが発生しました。<br />
                        (The application encountered a critical error.)
                    </p>
                    <pre className="text-xs bg-gray-100 p-2 rounded mb-4 text-left overflow-auto max-h-32">
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg active:scale-95 transition-transform"
                    >
                        再読み込み (Reload)
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
