
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileChange, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileChange(files[0]);
    }
  };

  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    onFileChange(null);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => onFileChange(e.target.files ? e.target.files[0] : null)}
        className="hidden"
        accept="image/*"
      />
      {previewUrl ? (
        <div className="relative group">
          <img src={previewUrl} alt="Dress preview" className="w-full h-auto object-cover rounded-xl" />
          <button
            onClick={handleClearImage}
            className="absolute top-2 right-2 p-1 bg-white/70 rounded-full text-stone-700 hover:bg-white hover:text-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleFileSelect}
          className="cursor-pointer w-full aspect-square border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-center p-4 text-stone-500 hover:bg-stone-100 hover:border-pink-400 hover:text-pink-500 transition-colors"
        >
          <UploadIcon className="w-10 h-10 mb-2" />
          <span className="font-semibold">Click to upload</span>
          <span className="text-sm">or drag and drop</span>
        </label>
      )}
    </div>
  );
};
