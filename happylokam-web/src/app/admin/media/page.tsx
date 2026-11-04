'use client';

import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Search, Trash2, Link as LinkIcon, Filter, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminMediaGallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) {
      toast.error('Only image files are allowed.');
      return;
    }
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} image(s) ready for upload.`);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setUploadedFiles(prev => [...prev, ...files]);
      toast.success(`${files.length} image(s) selected.`);
    }
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('No files selected.');
      return;
    }
    // In production, this would POST to your backend's upload endpoint
    toast.success(`Uploading ${uploadedFiles.length} files... (Connect cloud storage to complete)`);
    setUploadedFiles([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Media & Uploads</h1>
          <p className="text-zinc-400 mt-2">Upload and manage images for events, venues, and banners.</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all ${
          isDragging ? 'border-rose-500 bg-rose-500/10' : 'border-white/20 bg-zinc-900/40 hover:bg-zinc-900/60'
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-rose-500 animate-bounce' : 'text-zinc-400'}`} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Drag & Drop your images here</h3>
        <p className="text-zinc-400 mb-6">Supports JPG, PNG, WEBP (Max 10MB per file)</p>
        <label className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer">
          Browse Files
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
        </label>
      </div>

      {/* Staged Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{uploadedFiles.length} file(s) staged</h2>
            <button onClick={handleUpload} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              Upload All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="relative bg-zinc-800 rounded-xl p-3 border border-white/5">
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                <p className="text-xs text-zinc-400 truncate">{file.name}</p>
                <p className="text-xs text-zinc-600">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                <button
                  onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-start gap-4">
        <Info className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-white font-bold mb-1">How Media Works</h3>
          <p className="text-zinc-400 text-sm">
            Images you upload here will be stored in your cloud storage. You can then use the image URLs 
            when creating events, venue listings, or banners. Each event and venue has an Image URL field 
            where you paste the link after uploading.
          </p>
        </div>
      </div>
    </div>
  );
}
