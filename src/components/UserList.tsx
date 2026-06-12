import React, { useState } from 'react';
import { User } from '../types';
import { Search, Printer } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface UserListProps {
  users: User[];
  onPrintList?: () => void;
}

export default function UserList({ users, onPrintList }: UserListProps) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = [...users].sort((a,b) => b.id - a.id).filter((u) => {
    if (!searchQuery) return true;
    return (
      u.name.toUpperCase().includes(searchQuery.toUpperCase()) ||
      u.login.toUpperCase().includes(searchQuery.toUpperCase())
    );
  });

  return (
    <div className={`flex flex-col h-full w-full p-6 gap-6 animate-fade-in ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`} id="user_list_container">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Usuários</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Gerencie seus operadores autorizados.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Pesquisar por nome ou login..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`border text-sm px-4 py-2 rounded-lg focus:ring-2 outline-none w-64 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-200'}`}
          />
          <button
            onClick={onPrintList}
            className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition-transform transform active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`flex-1 overflow-auto border rounded-xl shadow-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${theme === 'dark' ? 'border-slate-700 text-slate-500' : 'border-slate-100 text-slate-400'} text-xs uppercase tracking-wider font-semibold`}>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nome</th>
              <th className="px-6 py-4">Login</th>
              <th className="px-6 py-4">Perfil</th>
              <th className="px-6 py-4 text-center">Ativo</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700' : 'divide-slate-100'}`}>
            {filteredUsers.map((u) => (
              <tr
                key={u.id}
                className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <td className="px-6 py-4 text-slate-500 font-mono">#{u.id}</td>
                <td className="px-6 py-4">{u.name}</td>
                <td className="px-6 py-4 font-mono">{u.login}</td>
                <td className="px-6 py-4">{u.profile}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    u.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {u.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
