
import React, { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Transaction } from '../types';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('pt-BR');
    const monthStr = today.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
    const yearStr = today.getFullYear().toString();

    let todayGain = 0;
    let monthGain = 0;
    let yearGain = 0;

    transactions.forEach(t => {
      const d = new Date(t.timestamp);
      const tDay = d.toLocaleDateString('pt-BR');
      const tMonth = d.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });
      const tYear = d.getFullYear().toString();

      if (tDay === todayStr) todayGain += t.total;
      if (tMonth === monthStr) monthGain += t.total;
      if (tYear === yearStr) yearGain += t.total;
    });

    return { todayGain, monthGain, yearGain };
  }, [transactions]);

  const chartData = useMemo(() => {
    const data: Record<string, number> = {};

    transactions.forEach(t => {
      const d = new Date(t.timestamp);
      let label = "";

      if (timeframe === 'daily') {
        label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      } else if (timeframe === 'monthly') {
        label = d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      } else {
        label = d.getFullYear().toString();
      }

      data[label] = (data[label] || 0) + t.total;
    });

    return Object.entries(data).map(([name, total]) => ({ name, total })).sort((a,b) => timeframe === 'daily' ? a.name.localeCompare(b.name) : 0);
  }, [transactions, timeframe]);

  return (
    <div className="space-y-6 pb-20">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Ganhos Hoje</p>
          <p className="text-3xl font-black text-emerald-600">R$ {stats.todayGain.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-xs text-slate-400">
            <span className="bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded mr-2 font-bold">+5%</span> 
            em relação a ontem
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Mensal</p>
          <p className="text-3xl font-black text-slate-800">R$ {stats.monthGain.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-xs text-slate-400">
            Acumulado no mês corrente
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">Anual</p>
          <p className="text-3xl font-black text-slate-800">R$ {stats.yearGain.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-xs text-slate-400">
            Faturamento total em {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Desempenho de Vendas</h2>
            <p className="text-sm text-slate-500">Visualização gráfica do faturamento no período</p>
          </div>
          <div className="flex bg-slate-50 p-1 rounded-xl">
            {(['daily', 'monthly', 'yearly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  timeframe === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t === 'daily' ? 'Diário' : t === 'monthly' ? 'Mensal' : 'Anual'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Faturamento']}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Dados insuficientes para gerar o gráfico</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
