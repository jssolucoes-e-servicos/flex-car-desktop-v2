import React, { useState } from 'react';
import { Receipt } from '../types';
import { Search, Plus, Printer } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ReceiptListProps {
  receipts: Receipt[];
  onSelectReceipt: (receipt: Receipt) => void;
  onNewReceipt: () => void;
  onPrintReceipt: (receipt: Receipt) => void;
}

export default function ReceiptList({
  receipts,
  onSelectReceipt,
  onNewReceipt,
  onPrintReceipt,
}: ReceiptListProps) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Order by ID descending
  const sortedReceipts = [...receipts].sort((a, b) => b.id - a.id);

  const filteredReceipts = sortedReceipts.filter((r) => {
    if (!searchQuery) return true;
    const query = searchQuery.toUpperCase();
    
    return (
      r.recipientName.toUpperCase().includes(query) ||
      r.id.toString().includes(query)
    );
  });

  return (
    <div className={`flex flex-col h-full w-full p-6 gap-6 animate-fade-in ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`} id="receipt_list_container">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Recibos</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Gerencie todos os recibos emitidos.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center rounded-lg p-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
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
            onClick={onNewReceipt}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-transform transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Novo Recibo
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`flex-1 overflow-auto border rounded-xl shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${theme === 'dark' ? 'border-slate-700 text-slate-500' : 'border-slate-100 text-slate-400'} text-xs uppercase tracking-wider font-semibold`}>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nome do Recebedor</th>
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
            {filteredReceipts.length > 0 ? (
              filteredReceipts.map((r) => (
                <tr
                  key={r.id}
                  onDoubleClick={() => onSelectReceipt(r)}
                  className={`cursor-pointer text-sm font-medium transition-colors ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <td className="px-6 py-4 text-slate-500 font-mono">#{r.id}</td>
                  <td className="px-6 py-4">{r.recipientName}</td>
                  <td className="px-6 py-4 text-emerald-500 font-semibold font-mono">
                    R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">{r.createdAt}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onPrintReceipt(r)}
                      className={`font-semibold text-xs ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      Imprimir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  Nenhum recibo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
