import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { User, Lock, Save, Camera } from 'lucide-react';

export default function UserProfile({ user, onCancel }: { user: any; onCancel: () => void; }) {
  const { theme } = useTheme();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  return (
    <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xl`}>
      <h2 className="text-xl font-bold mb-6">Perfil do Usuário</h2>
      
      <div className="flex items-center gap-6 mb-8">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
          <User className="w-12 h-12" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{user.profile}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Senha Atual</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 focus:ring-blue-500'}`} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nova Senha</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 focus:ring-blue-500'}`} />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button onClick={onCancel} className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}>Cancelar</button>
        <button className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Alterações
        </button>
      </div>
    </div>
  );
}
