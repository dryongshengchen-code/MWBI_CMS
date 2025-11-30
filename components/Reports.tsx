import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ReportData } from '../types';
import { generateReportInsight } from '../services/geminiService';
import { Lightbulb, RefreshCw } from 'lucide-react';

interface ReportsProps {
  donationData: ReportData[];
  userData: ReportData[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

export const Reports: React.FC<ReportsProps> = ({ donationData, userData }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'donations' | 'users'>('donations');

  const getInsight = async () => {
    setLoading(true);
    const data = activeTab === 'donations' ? donationData : userData;
    const name = activeTab === 'donations' ? "Donation Summary" : "User Registration Summary";
    const result = await generateReportInsight(name, data);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Analytics & Reports</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
                onClick={() => { setActiveTab('donations'); setInsight(null); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'donations' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Donations
            </button>
            <button 
                onClick={() => { setActiveTab('users'); setInsight(null); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Users
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
           <h3 className="text-lg font-bold text-slate-800 mb-6">
             {activeTab === 'donations' ? 'Donation Summary (Last 6 Months)' : 'Registered User Distribution'}
           </h3>
           
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               {activeTab === 'donations' ? (
                 <BarChart data={donationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} prefix="$" />
                    <Tooltip 
                        contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                        cursor={{fill: '#f1f5f9'}}
                    />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                 </BarChart>
               ) : (
                 <PieChart>
                    <Pie
                        data={userData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {userData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                    <Legend verticalAlign="bottom" height={36} />
                 </PieChart>
               )}
             </ResponsiveContainer>
           </div>
        </div>

        {/* AI Insight Area */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl shadow-sm border border-indigo-100 flex flex-col">
           <div className="flex items-center space-x-2 text-indigo-700 mb-4">
              <Lightbulb size={24} />
              <h3 className="text-lg font-bold">AI Insights</h3>
           </div>
           
           <div className="flex-1">
             {insight ? (
               <div className="prose prose-sm text-slate-600 animate-fadeIn">
                 <p className="leading-relaxed">{insight}</p>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                 <p className="mb-4 text-sm">Generate an AI analysis of this report data to identify trends.</p>
               </div>
             )}
           </div>

           <button 
             onClick={getInsight}
             disabled={loading}
             className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center space-x-2 shadow-md shadow-indigo-200"
           >
             <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
             <span>{loading ? 'Analyzing...' : 'Generate Analysis'}</span>
           </button>
        </div>
      </div>
    </div>
  );
};