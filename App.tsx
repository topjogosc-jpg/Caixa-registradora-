
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import POS from './components/POS';
import History from './components/History';
import Analytics from './components/Analytics';
import ProductManagement from './components/ProductManagement';
import { Transaction, Product } from './types';
import { getBusinessInsights } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pos' | 'history' | 'analytics' | 'products'>('pos');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTx = localStorage.getItem('pos_transactions');
    if (savedTx) setTransactions(JSON.parse(savedTx));

    const savedProducts = localStorage.getItem('pos_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Carga inicial sugerida para o usuário não começar vazio
      const initialProducts: Product[] = [
        { id: '1', code: '7891000123456', name: 'Arroz Premium 5kg', price: 24.90 },
        { id: '2', code: '12345678', name: 'Refrigerante 2L', price: 7.99 }
      ];
      setProducts(initialProducts);
    }
  }, []);

  // Persist transactions
  useEffect(() => {
    localStorage.setItem('pos_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Persist products
  useEffect(() => {
    localStorage.setItem('pos_products', JSON.stringify(products));
  }, [products]);

  // Handle AI insights
  useEffect(() => {
    const fetchInsight = async () => {
      if (transactions.length > 0) {
        setLoadingInsight(true);
        const insight = await getBusinessInsights(transactions);
        setAiInsight(insight);
        setLoadingInsight(false);
      }
    };
    if (transactions.length > 0 && !aiInsight) {
        fetchInsight();
    }
  }, [transactions, aiInsight]);

  const handleCompleteTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, tx]);
  };

  const handleAddProduct = (p: Product) => {
    setProducts(prev => [...prev, p]);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Deseja realmente excluir este produto do catálogo?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleClearAllProducts = () => {
    if (confirm("ATENÇÃO: Isso apagará TODOS os produtos cadastrados. Deseja continuar?")) {
      setProducts([]);
    }
  };

  const clearHistory = () => {
    setTransactions([]);
    setAiInsight(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-20 md:ml-64 p-4 md:p-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'pos' && 'Ponto de Venda'}
              {activeTab === 'history' && 'Histórico de Vendas'}
              {activeTab === 'analytics' && 'Análise de Desempenho'}
              {activeTab === 'products' && 'Gestão de Catálogo'}
            </h1>
            <p className="text-slate-500 font-medium">
              {activeTab === 'pos' && 'Efetue vendas de forma rápida e segura'}
              {activeTab === 'history' && 'Gerencie o registro das suas transações'}
              {activeTab === 'analytics' && 'Acompanhe seus ganhos e crescimento'}
              {activeTab === 'products' && 'Cadastre e gerencie seus produtos e preços'}
            </p>
          </div>

          {/* AI Insights Bar */}
          {aiInsight && (
            <div className="bg-emerald-600/10 border border-emerald-600/20 p-4 rounded-2xl max-w-md animate-in fade-in zoom-in duration-500">
               <div className="flex items-start gap-3">
                 <div className="p-1.5 bg-emerald-600 rounded-lg text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider mb-0.5">Dica da IA SmartPOS</p>
                    <p className="text-xs text-emerald-900 font-medium italic">"{aiInsight}"</p>
                 </div>
               </div>
            </div>
          )}
        </header>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'pos' && (
            <POS products={products} onCompleteTransaction={handleCompleteTransaction} />
          )}
          
          {activeTab === 'history' && (
            <History transactions={transactions} onClearHistory={clearHistory} />
          )}
          
          {activeTab === 'analytics' && (
            <Analytics transactions={transactions} />
          )}

          {activeTab === 'products' && (
            <ProductManagement 
              products={products} 
              onAddProduct={handleAddProduct} 
              onDeleteProduct={handleDeleteProduct} 
              onClearAllProducts={handleClearAllProducts}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
