import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Save, Building, Image as ImageIcon } from 'lucide-react';

export default function CompanySettings({ onCancel }: { onCancel: () => void }) {
  const { theme } = useTheme();
  
  const [razao, setRazao] = useState('Oficina FlexCar Ltda');
  const [fantasia, setFantasia] = useState('Oficina FlexCar');
  const [cnpj, setCnpj] = useState('00.000.000/0001-00');
  const [ie, setIe] = useState('000.000.000.000');
  const [cep, setCep] = useState('00000-000');
  const [logradouro, setLogradouro] = useState('Rua Exemplo');
  const [numero, setNumero] = useState('123');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('Centro');
  const [cidade, setCidade] = useState('Cidade');
  const [estado, setEstado] = useState('UF');
  const [plano, setPlano] = useState('Premium Mensal');
  const [expiracao, setExpiracao] = useState('2026-12-31');

  return (
    <div className={`p-6 rounded-2xl shadow-xl max-w-3xl w-full ${theme === 'dark' ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900 border border-slate-200'}`}>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Building className="w-6 h-6" /> Configurações da Empresa
      </h2>
      
      <div className="flex gap-6">
        <div className="w-1/3">
          <label className="block text-sm font-medium mb-2">Logo</label>
          <div className={`w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 ${theme === 'dark' ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-slate-50'}`}>
            <ImageIcon className="w-12 h-12 opacity-50" />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Razão Social</label>
              <input type="text" value={razao} onChange={(e) => setRazao(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nome Fantasia</label>
              <input type="text" value={fantasia} onChange={(e) => setFantasia(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">CNPJ</label>
              <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">IE</label>
              <input type="text" value={ie} onChange={(e) => setIe(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">CEP</label>
              <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Logradouro</label>
              <input type="text" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Número</label>
              <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium mb-1">Complemento</label>
              <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Bairro</label>
              <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">UF</label>
              <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Plano</label>
              <input type="text" value={plano} onChange={(e) => setPlano(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data de Expiração</label>
              <input type="date" value={expiracao} onChange={(e) => setExpiracao(e.target.value)} className={`w-full p-2 rounded border focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-slate-100 focus:ring-blue-900' : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-blue-500'}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button onClick={onCancel} className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300'}`}>Cancelar</button>
        <button className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar
        </button>
      </div>
    </div>
  );
}
