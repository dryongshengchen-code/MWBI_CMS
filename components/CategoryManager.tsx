import React, { useState } from 'react';
import { Category } from '../types';
import { Folder, FolderOpen, Plus, Trash2, ChevronRight, ChevronDown } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, setCategories }) => {
  const [newCatName, setNewCatName] = useState('');
  const [selectedParent, setSelectedParent] = useState<string | null>(null);

  // Helper to build tree
  const buildTree = (cats: Category[], parentId: string | null = null): Category[] => {
    return cats
      .filter(cat => cat.parentId === parentId)
      .map(cat => ({
        ...cat,
        children: buildTree(cats, cat.id)
      }));
  };

  const tree = buildTree(categories);

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: Category = {
      id: crypto.randomUUID(),
      name: newCatName,
      parentId: selectedParent,
      level: selectedParent ? (categories.find(c => c.id === selectedParent)?.level || 0) + 1 : 0
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
  };

  const deleteCategory = (id: string) => {
    // Basic implementation: prevent delete if children exist or implement cascading delete
    const hasChildren = categories.some(c => c.parentId === id);
    if (hasChildren) {
      alert("Cannot delete category with sub-categories.");
      return;
    }
    setCategories(categories.filter(c => c.id !== id));
    if (selectedParent === id) setSelectedParent(null);
  };

  const CategoryNode: React.FC<{ category: Category }> = ({ category }) => {
    const [isOpen, setIsOpen] = useState(true);
    const isSelected = selectedParent === category.id;

    return (
      <div className="ml-4 border-l border-slate-200 pl-4 mt-2">
        <div className="flex items-center group">
           <button onClick={() => setIsOpen(!isOpen)} className="mr-2 text-slate-400 hover:text-indigo-500">
             {category.children && category.children.length > 0 ? (
               isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
             ) : <div className="w-[14px]" />}
           </button>
           
           <div 
             onClick={() => setSelectedParent(isSelected ? null : category.id)}
             className={`flex-1 flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
               isSelected ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-50 text-slate-700 border border-transparent'
             }`}
           >
             <div className="flex items-center space-x-2">
               {isOpen ? <FolderOpen size={16} className={isSelected ? "text-indigo-500" : "text-slate-400"} /> : <Folder size={16} className={isSelected ? "text-indigo-500" : "text-slate-400"} />}
               <span className="font-medium">{category.name}</span>
               <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded-full border border-slate-200">Lvl {category.level}</span>
             </div>
             
             <button 
              onClick={(e) => { e.stopPropagation(); deleteCategory(category.id); }}
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1"
             >
               <Trash2 size={14} />
             </button>
           </div>
        </div>
        
        {isOpen && category.children && category.children.map(child => (
          <CategoryNode key={child.id} category={child} />
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Tree View */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <FolderTreeIcon className="mr-2 text-indigo-600" />
            Category Structure
         </h3>
         <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/50 min-h-[300px]">
            {tree.map(node => (
              <div key={node.id} className="-ml-8">
                <CategoryNode category={node} />
              </div>
            ))}
            {tree.length === 0 && <p className="text-slate-400 text-center mt-10">No categories defined.</p>}
         </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add Category</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Parent Category</label>
            <div className={`p-3 rounded-lg border ${selectedParent ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
              {selectedParent 
                ? categories.find(c => c.id === selectedParent)?.name 
                : "Root (Top Level)"}
            </div>
            {selectedParent && (
              <button 
                onClick={() => setSelectedParent(null)}
                className="text-xs text-red-500 hover:underline mt-1"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Category Name</label>
            <input 
              type="text" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
              placeholder="e.g., Electronics"
            />
          </div>

          <button 
            onClick={addCategory}
            disabled={!newCatName}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center space-x-2"
          >
            <Plus size={18} />
            <span>Create Category</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const FolderTreeIcon = ({className}:{className?:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10Z" opacity="0"/><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M2 10h20"/></svg>
);