import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ViewState, FileItem, Product, Category, ContentDraft, ReportData } from './types';
import { FileManager } from './components/FileManager';
import { ContentReview } from './components/ContentReview';
import { CategoryManager } from './components/CategoryManager';
import { ProductCreator } from './components/ProductCreator';
import { Reports } from './components/Reports';

// --- Mock Data ---
const initialCategories: Category[] = [
  { id: '1', name: 'Electronics', parentId: null, level: 0 },
  { id: '2', name: 'Laptops', parentId: '1', level: 1 },
  { id: '3', name: 'Accessories', parentId: '1', level: 1 },
  { id: '4', name: 'Home & Garden', parentId: null, level: 0 },
];

const initialContent: ContentDraft[] = [
  { id: 'c1', title: 'Top 10 Tech Trends 2024', body: 'The teck industry is evolvng fast. Artificial Inteligence is everywere now...', status: 'draft', author: 'Jane Doe', date: '2023-10-25' },
  { id: 'c2', title: 'Gardening Tips for Spring', body: 'Start early. Thats the key. watter your plants daily.', status: 'draft', author: 'John Smith', date: '2023-10-26' },
  { id: 'c3', title: 'Company Policy Update', body: 'We have updated our remote work policy effective immediately.', status: 'published', author: 'HR Dept', date: '2023-10-20' },
];

const initialDonations: ReportData[] = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const initialUsers: ReportData[] = [
  { name: 'Free Tier', value: 400 },
  { name: 'Pro Tier', value: 300 },
  { name: 'Enterprise', value: 100 },
];

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>([]);
  const [contentList, setContentList] = useState<ContentDraft[]>(initialContent);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return (
          <div className="space-y-6">
             <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-2">Welcome back, Admin.</h2>
                <p className="opacity-90">Here is what is happening in your Nexus CMS today.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-sm font-medium uppercase">Pending Review</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{contentList.filter(c => c.status === 'draft').length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-sm font-medium uppercase">Total Products</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-slate-500 text-sm font-medium uppercase">Total Donations (Jun)</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">$2,390</p>
                </div>
             </div>
          </div>
        );
      case ViewState.FILES:
        return <FileManager files={files} setFiles={setFiles} />;
      case ViewState.CONTENT:
        return <ContentReview contentList={contentList} setContentList={setContentList} />;
      case ViewState.CATEGORIES:
        return <CategoryManager categories={categories} setCategories={setCategories} />;
      case ViewState.PRODUCTS:
        return <ProductCreator products={products} setProducts={setProducts} categories={categories} files={files} setFiles={setFiles} />;
      case ViewState.REPORTS:
        return <Reports donationData={initialDonations} userData={initialUsers} />;
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;