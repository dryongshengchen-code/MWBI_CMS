import React, { useState } from 'react';
import { ContentDraft } from '../types';
import { CheckCircle, AlertCircle, Wand2, Edit3 } from 'lucide-react';
import { polishContent } from '../services/geminiService';

interface ContentReviewProps {
  contentList: ContentDraft[];
  setContentList: React.Dispatch<React.SetStateAction<ContentDraft[]>>;
}

export const ContentReview: React.FC<ContentReviewProps> = ({ contentList, setContentList }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  const selectedItem = contentList.find(c => c.id === selectedId);

  const handleSelect = (item: ContentDraft) => {
    setSelectedId(item.id);
    setEditBody(item.body);
  };

  const handlePublish = () => {
    if (!selectedId) return;
    setContentList(prev => prev.map(item => 
      item.id === selectedId ? { ...item, body: editBody, status: 'published' } : item
    ));
    setSelectedId(null);
  };

  const handleAIPolish = async () => {
    if (!editBody) return;
    setIsPolishing(true);
    const polished = await polishContent(editBody);
    setEditBody(polished);
    setIsPolishing(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      {/* List */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-700">Review Queue</h3>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {contentList.map(item => (
            <div 
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`p-4 rounded-lg cursor-pointer border transition-all ${
                selectedId === item.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-slate-900 line-clamp-1">{item.title}</h4>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">By {item.author} • {item.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        {selectedItem ? (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedItem.title}</h2>
                <p className="text-sm text-slate-500">Editing Mode</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleAIPolish}
                  disabled={isPolishing}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Wand2 size={16} className={isPolishing ? "animate-spin" : ""} />
                  <span>{isPolishing ? 'Polishing...' : 'AI Polish'}</span>
                </button>
                <button 
                  onClick={handlePublish}
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <CheckCircle size={16} />
                  <span>Publish</span>
                </button>
              </div>
            </div>
            <div className="flex-1 p-6">
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="w-full h-full p-4 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none font-sans text-slate-700 leading-relaxed"
                placeholder="Content body..."
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Edit3 size={48} className="mb-4 opacity-50" />
            <p>Select an item from the queue to review</p>
          </div>
        )}
      </div>
    </div>
  );
};