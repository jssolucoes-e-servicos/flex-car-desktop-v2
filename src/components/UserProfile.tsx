import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { User, Lock, Save } from 'lucide-react';
import { User as UserType } from '../types';

export default function UserProfile({ user, onCancel }: { user: UserType; onCancel: () => void; }) {
  const { theme } = useTheme();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  return (
    <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} shadow-xl max-w-lg w-full relative`}>
      <h2 className="text-xl font-bold mb-6">Meu Perfil</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 focus:ring-blue-500'}`} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 focus:ring-blue-500'}`} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 focus:ring-blue-500'}`} />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button onClick={() => setShowPasswordModal(true)} className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'} flex items-center gap-2`}>
            <Lock className="w-4 h-4" />
            Trocar Senha
        </button>
        <button onClick={onCancel} className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}>Cancelar</button>
        <button className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar
        </button>
      </div>

      {showPasswordModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center p-6">
            <div className={`p-6 rounded-2xl shadow-xl w-full ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
                <h3 className="text-lg font-bold mb-4">Alterar Senha</h3>
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
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={() => setShowPasswordModal(false)} className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}>Cancelar</button>
                    <button onClick={() => setShowPasswordModal(false)} className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Confirmar</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
