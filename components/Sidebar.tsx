import React from 'react';
import { LayoutDashboard, FileText, FolderTree, ShoppingBag, BarChart3, Files, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  
  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: ViewState.FILES, label: 'File Manager', icon: Files },
    { view: ViewState.CONTENT, label: 'Content Review', icon: FileText },
    { view: ViewState.CATEGORIES, label: 'Categories', icon: FolderTree },
    { view: ViewState.PRODUCTS, label: 'Products', icon: ShoppingBag },
    { view: ViewState.REPORTS, label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Nexus CMS
        </h1>
        <p className="text-xs text-slate-400 mt-1">v2.0.1 Enterprise</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.view 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};