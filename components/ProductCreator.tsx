import React, { useState } from 'react';
import { Product, Category, FileItem } from '../types';
import { FileManager } from './FileManager';
import { Save, Plus, X, Image as ImageIcon } from 'lucide-react';

interface ProductCreatorProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
}

export const ProductCreator: React.FC<ProductCreatorProps> = ({ products, setProducts, categories, files, setFiles }) => {
  const [mode, setMode] = useState<'create' | 'edit' | 'list'>('list');
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [showFileSelector, setShowFileSelector] = useState(false);

  const resetForm = () => {
    setFormData({});
    setMode('list');
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert("Please fill in required fields");
      return;
    }

    const product: Product = {
      id: formData.id || crypto.randomUUID(),
      name: formData.name,
      description: formData.description || '',
      price: Number(formData.price),
      categoryId: formData.categoryId,
      imageId: formData.imageId || null
    };

    if (mode === 'create') {
      setProducts([...products, product]);
    } else {
      setProducts(products.map(p => p.id === product.id ? product : p));
    }
    resetForm();
  };

  const selectedImage = files.find(f => f.id === formData.imageId);

  if (mode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Product Catalog</h2>
          <button 
            onClick={() => { setMode('create'); setFormData({}); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Product</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium text-right">Price</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => {
                const catName = categories.find(c => c.id === product.categoryId)?.name || 'Unknown';
                const imgUrl = files.find(f => f.id === product.imageId)?.url;
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                         {imgUrl ? <img src={imgUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={16}/></div>}
                      </div>
                      <span className="font-medium text-slate-900">{product.name}</span>
                    </td>
                    <td className="p-4 text-slate-500">{catName}</td>
                    <td className="p-4 text-right font-mono text-slate-700">${product.price.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => { setMode('edit'); setFormData(product); }}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                 <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">No products found. Create one to get started.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={resetForm} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
            <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          {mode === 'create' ? 'Create New Product' : 'Edit Product'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={formData.name || ''}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                  placeholder="e.g. ergonomic Chair"
                />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-slate-400">$</span>
                        <input 
                        type="number" 
                        value={formData.price || ''}
                        onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                        className="w-full pl-7 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                        placeholder="0.00"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                        value={formData.categoryId || ''}
                        onChange={e => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none bg-white"
                    >
                        <option value="">Select Category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  rows={4}
                  value={formData.description || ''}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                  placeholder="Describe the product..."
                />
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-3">Product Image</label>
              
              <div 
                onClick={() => setShowFileSelector(true)}
                className="aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-slate-50 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group"
              >
                  {selectedImage ? (
                      <>
                        <img src={selectedImage.url} className="w-full h-full object-cover" alt="Product" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white text-sm font-medium">Change Image</span>
                        </div>
                      </>
                  ) : (
                      <>
                        <ImageIcon className="text-slate-400 mb-2" size={32} />
                        <span className="text-sm text-slate-500">Select Image</span>
                      </>
                  )}
              </div>
           </div>

           <button 
              onClick={handleSave}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center space-x-2"
           >
              <Save size={18} />
              <span>Save Product</span>
           </button>
        </div>
      </div>

      {/* File Selector Modal */}
      {showFileSelector && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-4xl h-[80vh] rounded-xl shadow-2xl flex flex-col">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                      <h3 className="font-bold text-lg">Select Image</h3>
                      <button onClick={() => setShowFileSelector(false)}><X className="text-slate-500" /></button>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto bg-slate-50">
                      <FileManager 
                        files={files} 
                        setFiles={setFiles} 
                        selectMode 
                        onSelect={(file) => {
                             if(file.type === 'image') {
                                 setFormData({...formData, imageId: file.id});
                                 setShowFileSelector(false);
                             } else {
                                 alert("Please select an image file.");
                             }
                        }}
                      />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};