'use client';

import { PredictionResponse } from '../lib/types';

interface ResultsDisplayProps {
    result: PredictionResponse;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
    const confidencePercentage = (result.confidence * 100).toFixed(1);
    const confidenceColor = result.confidence > 0.8 ? 'emerald' : result.confidence > 0.6 ? 'yellow' : 'orange';

    const formatRemedy = (remedy: string) => {
        const sections = remedy.split('\n\n');
        return sections.map((section, index) => {
            if (section.startsWith('**')) {
                const lines = section.split('\n');
                const title = lines[0].replace(/\*\*/g, '');
                const content = lines.slice(1).join('\n');

                const getIcon = (title: string) => {
                    if (title.toLowerCase().includes('overview')) return '📋';
                    if (title.toLowerCase().includes('treatment')) return '💊';
                    if (title.toLowerCase().includes('cultural')) return '🌱';
                    if (title.toLowerCase().includes('prevention')) return '🛡️';
                    if (title.toLowerCase().includes('important')) return '⚠️';
                    return '📌';
                };

                return (
                    <div key={index} className="mb-6 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                            <span className="text-2xl">{getIcon(title)}</span>
                            {title}
                        </h3>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-line pl-11">{content}</div>
                    </div>
                );
            }
            return (
                <p key={index} className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                    {section}
                </p>
            );
        });
    };

    return (
        <div className="w-full space-y-6 animate-fade-in">
            {/* Disease Name Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 shadow-2xl shadow-emerald-500/30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Detected Disease</h2>
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">{result.predicted_class}</p>
                </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
                            <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-600">Confidence Score</h3>
                            <p className="text-xs text-gray-500">Model prediction accuracy</p>
                        </div>
                    </div>
                    <span className={`text-4xl font-black bg-gradient-to-r from-${confidenceColor}-600 to-${confidenceColor}-500 bg-clip-text text-transparent`}>
                        {confidencePercentage}%
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                        className={`bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg`}
                        style={{ width: `${confidencePercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Remedy Section */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Treatment Plan</h2>
                        <p className="text-sm text-gray-500">AI-generated recommendations</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {formatRemedy(result.remedy)}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => window.print()}
                    className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-emerald-500/30 transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 flex items-center justify-center gap-3"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Report
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(result.remedy);
                        alert('Remedy copied to clipboard!');
                    }}
                    className="group bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3 border border-gray-300"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Remedy
                </button>
            </div>
        </div>
    );
}
