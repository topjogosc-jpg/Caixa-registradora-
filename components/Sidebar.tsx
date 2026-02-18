
import React from 'react';

interface SidebarProps {
  activeTab: 'pos' | 'history' | 'analytics' | 'products';
  setActiveTab: (tab: 'pos' | 'history' | 'analytics' | 'products') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-20 md:w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-4 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          S
        </div>
        <span className="hidden md:block font-bold text-slate-800 text-lg">SmartPOS</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab('pos')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
            activeTab === 'pos' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="hidden md:block font-medium">Caixa</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
            activeTab === 'products' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="hidden md:block font-medium">Produtos</span>
        </button>
        
        <button
          onClick={() => setActiveTab('history')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
            activeTab === 'history' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="hidden md:block font-medium">Histórico</span>
        </button>
        
        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
            activeTab === 'analytics' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="hidden md:block font-medium">Relatórios</span>
        </button>
      </nav>
      
      <div className="p-4 border-t border-slate-100 hidden md:block">
        <div className="bg-slate-900 rounded-xl p-4 text-white">
          <p className="text-xs text-slate-400 mb-1">Status do Sistema</p>
          <p className="text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Online
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
