
import React, { useState } from 'react';
import { Product } from '../types';
import ProductPhotoCamera from './ProductPhotoCamera';

interface ProductManagementProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onClearAllProducts: () => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ 
  products, 
  onAddProduct, 
  onDeleteProduct,
  onClearAllProducts
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name,
      code,
      price: parseFloat(price),
      imageUrl: imageUrl || undefined
    };

    onAddProduct(newProduct);
    handleClearFields();
  };

  const handleClearFields = () => {
    setName('');
    setCode('');
    setPrice('');
    setImageUrl(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      {showCamera && (
        <ProductPhotoCamera 
          onCapture={(base64) => setImageUrl(base64)} 
          onClose={() => setShowCamera(false)} 
        />
      )}

      {/* Form Area */}
      <div className="lg:col-span-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Cadastrar Produto</h2>
          
          <div className="mb-6 flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImageUrl(null)}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold"
                  >
                    Remover Foto
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[10px] uppercase font-bold">Sem Foto</span>
                </div>
              )}
            </div>
            <button 
              type="button"
              onClick={() => setShowCamera(true)}
              className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
            >
              {imageUrl ? "Tirar outra foto" : "Adicionar Foto"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Arroz Tio João 5kg"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Código (Opcional)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="EAN / Código de barras"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0,00"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleClearFields}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
              >
                Limpar
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List Area */}
      <div className="lg:col-span-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Catálogo de Produtos</h2>
              <p className="text-sm text-slate-500">{products.length} itens cadastrados</p>
            </div>
            {products.length > 0 && (
              <button
                onClick={onClearAllProducts}
                className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpar Catálogo
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      Nenhum produto cadastrado.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{p.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-slate-500">{p.code || '---'}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">
                        R$ {p.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => onDeleteProduct(p.id)}
                          className="text-slate-300 hover:text-red-500 transition-all p-2 rounded-lg"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
