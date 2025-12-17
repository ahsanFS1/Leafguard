'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
    onImageSelect: (file: File) => void;
    disabled?: boolean;
}

export default function ImageUpload({ onImageSelect, disabled }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageSelect(file);
    };

    const handleClear = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            {!preview ? (
                <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={`
            relative border-3 border-dashed rounded-3xl p-16 text-center cursor-pointer
            transition-all duration-300 ease-out group
            ${isDragging
                            ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 scale-[1.02] shadow-2xl'
                            : 'border-gray-300 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-emerald-50/30 hover:shadow-xl'
                        }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className={`
              w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 
              flex items-center justify-center transition-all duration-300
              ${isDragging ? 'scale-110 rotate-6' : 'group-hover:scale-105'}
            `}>
                            <svg
                                className={`w-12 h-12 transition-colors duration-300 ${isDragging ? 'text-emerald-600' : 'text-emerald-500 group-hover:text-emerald-600'
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800 mb-2">
                                {isDragging ? 'Drop it here!' : 'Upload Plant Image'}
                            </p>
                            <p className="text-base text-gray-600">
                                Drag and drop or click to browse
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="px-3 py-1 bg-white rounded-full border border-gray-200">JPG</span>
                            <span className="px-3 py-1 bg-white rounded-full border border-gray-200">PNG</span>
                            <span className="px-3 py-1 bg-white rounded-full border border-gray-200">JPEG</span>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        disabled={disabled}
                    />
                </div>
            ) : (
                <div className="relative group">
                    <div className="relative w-full h-[500px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-contain bg-gradient-to-br from-gray-50 to-gray-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <button
                        onClick={handleClear}
                        disabled={disabled}
                        className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-red-500/40 transition-all duration-200 hover:shadow-red-500/60 hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                    </button>
                </div>
            )}
        </div>
    );
}
