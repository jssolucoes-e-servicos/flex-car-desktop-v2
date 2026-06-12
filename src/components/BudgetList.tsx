import React, { useState } from 'react';
import { Budget } from '../types';
import { Search, Plus, Printer, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BudgetListProps {
  budgets: Budget[];
  onSelectBudget: (budget: Budget) => void;
  onNewBudget: () => void;
  onPrintBudget: (budget: Budget) => void;
}

export default function BudgetList({
  budgets,
  onSelectBudget,
  onNewBudget,
  onPrintBudget,
}: BudgetListProps) {
  const { theme } = useTheme();
  const [searchField, setSearchField] = useState<'TUDO' | 'NOME' | 'PLACA' | 'MODELO'>('TUDO');
  const [searchQuery, setSearchQuery] = useState('');

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Order by ID descending
  const sortedBudgets = [...budgets].sort((a, b) => b.id - a.id);

  const filteredBudgets = sortedBudgets.filter((b) => {
    if (!searchQuery) return true;
    const query = searchQuery.toUpperCase();
    
    if (searchField === 'TUDO') {
        return (
          b.clientName.toUpperCase().includes(query) ||
          b.placa.toUpperCase().includes(query) ||
          b.modelo.toUpperCase().includes(query) ||
          b.id.toString().includes(query)
        );
    }
    
    if (searchField === 'NOME') {
      return b.clientName.toUpperCase().includes(query);
    } else if (searchField === 'PLACA') {
      return b.placa.toUpperCase().includes(query);
    } else if (searchField === 'MODELO') {
      return b.modelo.toUpperCase().includes(query);
    }
    return true;
  });

  return (
    <div className={`flex flex-col h-full w-full p-6 gap-6 animate-fade-in ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`} id="budget_list_container">
      
      {/* Header and Search */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Orçamentos</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Gerencie todos os orçamentos de serviços.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center rounded-lg p-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as any)}
              className={`bg-transparent text-sm font-medium px-3 py-1.5 focus:outline-none ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
            >
              <option value="TUDO">Tudo</option>
              <option value="NOME">Cliente</option>
              <option value="PLACA">Placa</option>
              <option value="MODELO">Modelo</option>
            </select>
            <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`border text-sm px-3 py-1.5 rounded-lg focus:ring-2 outline-none w-64 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-200'}`}
              />
            <button
              onClick={clearSearch}
              className={`text-xs px-2 font-medium ${theme === 'dark' ? 'text-slate-500 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}`}
            >
              Limpar
            </button>
          </div>

          <button
            onClick={onNewBudget}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo Orçamento
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`flex-1 overflow-auto border rounded-xl shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${theme === 'dark' ? 'border-slate-700 text-slate-500' : 'border-slate-100 text-slate-400'} text-xs uppercase tracking-wider font-semibold`}>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Marca</th>
              <th className="px-6 py-4">Modelo</th>
              <th className="px-6 py-4 text-center">Placa</th>
              <th className="px-6 py-4 text-right">Valor</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
            {filteredBudgets.length > 0 ? (
              filteredBudgets.map((b) => (
                <tr
                  key={b.id}
                  onDoubleClick={() => onSelectBudget(b)}
                  className={`cursor-pointer text-sm font-medium transition-colors ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <td className="px-6 py-4 text-slate-500 font-mono">#{b.id}</td>
                  <td className="px-6 py-4">{b.clientName}</td>
                  <td className="px-6 py-4 text-slate-500">{b.marca}</td>
                  <td className="px-6 py-4 text-slate-500">{b.modelo}</td>
                  <td className="px-6 py-4 text-center font-mono font-semibold">{b.placa}</td>
                  <td className="px-6 py-4 text-right text-emerald-500 font-semibold font-mono">
                    R$ {b.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onSelectBudget(b)}
                      className={`font-semibold text-xs ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={`px-6 py-12 text-center text-slate-400`}>
                  Nenhum orçamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
