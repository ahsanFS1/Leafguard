export default function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-24 h-24">
                <div className="absolute top-0 left-0 w-full h-full border-8 border-emerald-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute top-2 left-2 w-20 h-20 border-8 border-transparent border-t-teal-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <div className="mt-8 text-center">
                <p className="text-xl font-bold text-gray-800 mb-2 animate-pulse">Analyzing Your Plant</p>
                <p className="text-sm text-gray-500">Our AI is examining the image...</p>
            </div>
            <div className="flex gap-2 mt-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    );
}
