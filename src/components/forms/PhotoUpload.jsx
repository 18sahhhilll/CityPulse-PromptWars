import React, { useState } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

export const PhotoUpload = ({ onPhotoSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        if (onPhotoSelect) onPhotoSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onPhotoSelect) onPhotoSelect(null);
  };

  return (
    <div>
      {!preview ? (
        <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition-colors text-center">
          <Camera className="w-6 h-6 text-slate-400 mb-1" />
          <span className="text-xs font-medium text-slate-300">Upload Incident Photo (Optional)</span>
          <span className="text-[10px] text-slate-500">PNG, JPG up to 5MB</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-48">
          <img src={preview} alt="Upload preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
