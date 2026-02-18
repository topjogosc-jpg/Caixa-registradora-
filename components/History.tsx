
import React from 'react';
import { Transaction } from '../types';

interface HistoryProps {
  transactions: Transaction[];
  onClearHistory: () => void;
}

const History: React.FC<HistoryProps> = ({ transactions, onClearHistory }) => {
  const sortedTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Histórico de Transações</h2>
          <p className="text-sm text-slate-500">Listagem de todas as vendas realizadas</p>
        </div>
        <button
          onClick={() => {
            if (confirm("Tem certeza que deseja apagar todo o histórico?")) {
              onClearHistory();
            }
          }}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition-all"
        >
          Limpar Tudo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Data / Hora</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Itens</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                  Nenhuma transação registrada ainda.
                </td>
              </tr>
            ) : (
              sortedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-all group">
                  <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                    {new Date(tx.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {tx.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex flex-col mb-1">
                           <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase truncate max-w-[150px]">
                            {item.name}
                          </span>
                          {item.code && (
                            <span className="text-[8px] text-slate-400 font-mono pl-1">
                              #{item.code}
                            </span>
                          )}
                        </div>
                      ))}
                      {tx.items.length > 3 && (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase self-start">
                          +{tx.items.length - 3} mais
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-emerald-600">
                      R$ {tx.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-slate-400 hover:text-emerald-600 p-2 rounded-lg transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
  );
};

export default History;
