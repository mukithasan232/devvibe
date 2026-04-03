"use client";

import { useState, useCallback } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface ImageUploadDropzoneProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploadDropzone({ value, onChange }: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    fileArray.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      onChange([...value, ...data.urls]);
    } catch (error) {
      alert("Failed to upload images");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }, [value, onChange]);

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all ${isDragging ? "border-brand-neon bg-brand-neon/10" : "border-brand-card bg-brand-bg hover:border-brand-neon/50"}`}
      >
        <div className="flex flex-col items-center text-center space-y-2">
          {isUploading ? (
            <Loader2 className="w-10 h-10 animate-spin text-brand-neon" />
          ) : (
            <UploadCloud className={`w-10 h-10 ${isDragging ? "text-brand-neon" : "text-brand-muted"}`} />
          )}
          <div className="text-sm">
            {isUploading ? (
              <span className="text-brand-neon font-medium">Uploading images...</span>
            ) : (
              <span className="text-brand-muted">
                <span className="font-bold text-white">Click to upload</span> or drag and drop
              </span>
            )}
          </div>
          <p className="text-xs text-brand-muted/70">SVG, PNG, JPG or GIF (max. 5MB)</p>
        </div>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          disabled={isUploading}
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-brand-bg border border-brand-card">
              <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
