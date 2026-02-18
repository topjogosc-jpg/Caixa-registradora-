
import React, { useState, useEffect, useRef } from 'react';
import { SaleItem, Transaction, Product } from '../types';
import BarcodeScanner from './BarcodeScanner';
import { speak } from '../services/speechService';

interface POSProps {
  products: Product[];
  onCompleteTransaction: (transaction: Transaction) => void;
}

const POS: React.FC<POSProps> = ({ products, onCompleteTransaction }) => {
  const [currentCart, setCurrentCart] = useState<SaleItem[]>([]);
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState<string>('');
  const [itemQty, setItemQty] = useState<number>(1);
  const [isScanning, setIsScanning] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const subtotal = currentCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const addToCart = (name: string, price: string, qty: number, code?: string, imageUrl?: string) => {
    if (!name || !price) return;

    const newItem: SaleItem = {
      id: crypto.randomUUID(),
      name: name,
      price: parseFloat(price),
      quantity: qty,
      code: code || undefined,
      imageUrl: imageUrl || undefined
    };

    setCurrentCart(prev => [...prev, newItem]);
    
    if (isVoiceEnabled) {
      speak(`${name}. ${parseFloat(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    }

    setItemCode('');
    setItemName('');
    setItemPrice('');
    setItemQty(1);
    nameInputRef.current?.focus();
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addToCart(itemName, itemPrice, itemQty, itemCode);
  };

  const removeItem = (id: string) => {
    setCurrentCart(currentCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if (currentCart.length === 0) return;
    if (confirm("Deseja cancelar a venda atual e limpar o carrinho?")) {
      setCurrentCart([]);
      if (isVoiceEnabled) speak("Venda cancelada.");
    }
  };

  const handleBarcodeScanned = (code: string) => {
    const product = products.find(p => p.code === code);
    if (product) {
      addToCart(product.name, product.price.toString(), 1, code, product.imageUrl);
    } else {
      setItemCode(code);
      setItemName('');
      setItemPrice('');
      if (isVoiceEnabled) speak("Código não encontrado na base de dados.");
      setIsScanning(false);
    }
  };

  const finalizeSale = () => {
    if (currentCart.length === 0) return;

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      items: [...currentCart],
      total: subtotal,
      timestamp: Date.now(),
    };

    if (isVoiceEnabled) speak(`Venda finalizada. Total: ${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    
    onCompleteTransaction(transaction);
    setCurrentCart([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {isScanning && (
        <BarcodeScanner 
          onScan={handleBarcodeScanned} 
          onClose={() => setIsScanning(false)} 
        />
      )}

      {/* Input Section */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Novo Item</h2>
            <div className="flex gap-2">
               <button 
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-2 rounded-xl transition-all border ${
                  isVoiceEnabled ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                }`}
                title={isVoiceEnabled ? "Desativar Voz" : "Ativar Voz"}
              >
                {isVoiceEnabled ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
              </button>
              <button 
                onClick={() => setIsScanning(true)}
                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all flex items-center gap-2 text-sm font-bold border border-emerald-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Escanear
              </button>
            </div>
          </div>

          <form onSubmit={handleManualAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Código</label>
              <input
                type="text"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                placeholder="Código ou Scan"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Nome</label>
              <input
                ref={nameInputRef}
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Ex: Arroz 5kg"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Qtd</label>
                <input
                  type="number"
                  min="1"
                  value={itemQty}
                  onChange={(e) => setItemQty(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              Adicionar
            </button>
          </form>
        </div>

        {/* Quick buttons from catalog */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Seu Catálogo</h3>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {products.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">Vá em "Produtos" para cadastrar itens com foto.</p>
            ) : (
              products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p.name, p.price.toString(), 1, p.code, p.imageUrl)}
                  className="flex items-center gap-3 p-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-all border border-slate-100 group"
                >
                  <div className="w-10 h-10 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                    {p.imageUrl ? (
                        <img src={p.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-bold truncate group-hover:text-emerald-700">{p.name}</p>
                    <p className="text-[10px] text-slate-500">R$ {p.price.toFixed(2)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[600px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Carrinho</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={clearCart}
                disabled={currentCart.length === 0}
                className="text-slate-400 hover:text-red-500 text-sm font-bold disabled:opacity-30 transition-all"
              >
                Limpar Carrinho
              </button>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {currentCart.length} Itens
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {currentCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="font-medium">O carrinho está vazio</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentCart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl group animate-in slide-in-from-right-2 duration-200">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                            <img src={item.imageUrl} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-800">{item.name}</h4>
                          {item.code && (
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                              {item.code}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500">
                          {item.quantity} x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-500 font-medium">Total</span>
              <span className="text-3xl font-black text-slate-900">R$ {subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={finalizeSale}
              disabled={currentCart.length === 0}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all shadow-xl ${
                currentCart.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              FINALIZAR COMPRA
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default POS;
