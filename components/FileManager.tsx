import React, { useState } from 'react';
import { FileItem } from '../types';
import { Upload, Trash2, File, Image as ImageIcon, Eye } from 'lucide-react';

interface FileManagerProps {
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  onSelect?: (file: FileItem) => void;
  selectMode?: boolean;
}

export const FileManager: React.FC<FileManagerProps> = ({ files, setFiles, onSelect, selectMode = false }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFile: FileItem = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
        size: file.size,
        date: new Date().toLocaleDateString(),
      };
      setFiles((prev) => [newFile, ...prev]);
    }
  };

  const deleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prev) => prev.filter(f => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {selectMode ? 'Select a File' : 'File Management'}
        </h2>
        <div className="relative group">
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx"
          />
          <label 
            htmlFor="file-upload"
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            <Upload size={18} />
            <span>Upload File</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {files.map((file) => (
          <div 
            key={file.id}
            onClick={() => onSelect && onSelect(file)}
            className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative cursor-pointer ${selectMode ? 'hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100' : ''}`}
          >
            <div className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              {file.type === 'image' ? (
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <File className="text-slate-400" size={48} />
              )}
            </div>
            
            <div className="flex justify-between items-start">
              <div className="overflow-hidden">
                <p className="font-medium text-slate-800 truncate" title={file.name}>{file.name}</p>
                <p className="text-xs text-slate-500 mt-1">{formatSize(file.size)} • {file.date}</p>
              </div>
              {!selectMode && (
                <button 
                  onClick={(e) => deleteFile(file.id, e)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                    {selectMode ? 'Select' : <><Eye size={12} className="mr-1"/> Preview</>}
                </div>
            </div>
          </div>
        ))}
        
        {files.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-500">
            <div className="inline-flex bg-slate-100 p-4 rounded-full mb-4">
              <Upload size={32} className="text-slate-400" />
            </div>
            <p className="text-lg font-medium">No files uploaded yet</p>
            <p className="text-sm">Upload images or documents to manage them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};