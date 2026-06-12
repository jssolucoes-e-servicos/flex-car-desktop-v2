import React, { useState } from 'react';
import { Budget, ServiceItem } from '../types';
import { ShoppingCart, Check, Save, Trash2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BudgetFormProps {
  nextId: number;
  budgetToEdit?: Budget;
  onSave: (newBudget: Budget) => void;
  onCancel: () => void;
}

export default function BudgetForm({ nextId, budgetToEdit, onSave, onCancel }: BudgetFormProps) {
  const { theme } = useTheme();
  const [step, setStep] = useState<1 | 2>(1);

  // Form Inputs
  const [clientName, setClientName] = useState(budgetToEdit?.clientName || '');
  const [document, setDocument] = useState(budgetToEdit?.document || '');
  const [phone, setPhone] = useState(budgetToEdit?.phone || '');
  const [email, setEmail] = useState(budgetToEdit?.email || '');
  
  const [cep, setCep] = useState(budgetToEdit?.cep || '');
  const [rua, setRua] = useState(budgetToEdit?.rua || '');
  const [numero, setNumero] = useState(budgetToEdit?.numero || '');
  const [complemento, setComplemento] = useState(budgetToEdit?.complemento || '');
  const [bairro, setBairro] = useState(budgetToEdit?.bairro || '');
  const [cidade, setCidade] = useState(budgetToEdit?.cidade || '');

  const [marca, setMarca] = useState(budgetToEdit?.marca || '');
  const [modelo, setModelo] = useState(budgetToEdit?.modelo || '');
  const [placa, setPlaca] = useState(budgetToEdit?.placa || '');
  const [ano, setAno] = useState(budgetToEdit?.ano || '');
  const [km, setKm] = useState(budgetToEdit?.km || '');
  const [details, setDetails] = useState(budgetToEdit?.details || '');

  // Step 2 Item creation Inputs
  const [items, setItems] = useState<ServiceItem[]>(budgetToEdit?.items || []);
  const [itemName, setItemName] = useState('');
  const [itemValue, setItemValue] = useState('');

  const totalValue = items.reduce((acc, current) => acc + current.value, 0);

  const handleGoToItems = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('Por favor, informe o Nome do Cliente!');
      return;
    }
    if (!marca.trim() || !modelo.trim()) {
      alert('Por favor, defina a Marca e o Modelo do veículo!');
      return;
    }
    setStep(2);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    
    const valueNum = parseFloat(itemValue.replace(',', '.')) || 0;
    const newItem: ServiceItem = {
      id: Date.now().toString(),
      name: itemName.toUpperCase(),
      value: valueNum,
    };

    setItems([...items, newItem]);
    setItemName('');
    setItemValue('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const handleSaveBudget = () => {
    if (items.length === 0) {
      alert('Adicione pelo menos 1 serviço ou peça antes de gravar!');
      return;
    }

    const today = new Date();
    // Format "DD/MM/YYYY HH:MM:SS"
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const yearToday = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    const dateStr = `${day}/${month}/${yearToday} ${hours}:${minutes}:${seconds}`;

    const newBudgetData: Budget = {
      ...(budgetToEdit ? budgetToEdit : {
        id: nextId,
        createdAt: dateStr,
        status: 'PENDENTE',
        approved: false,
      }),
      clientName: clientName.toUpperCase(),
      document,
      phone,
      email,
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      marca: marca.toUpperCase(),
      modelo: modelo.toUpperCase(),
      placa: placa.toUpperCase(),
      ano,
      km,
      details,
      items,
      totalValue,
    };

    onSave(newBudgetData);
  };

  const formattedTotal = totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className={`flex-1 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'} flex flex-col h-full overflow-hidden select-text font-sans p-3`}>
      <div className={`p-4 rounded-t border-t border-x shadow flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        <div>
          <h2 className={`text-lg font-black tracking-wide uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            Novo Orçamento
          </h2>
          <p className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
            Criação de novo orçamento (Passo {step} de 2)
          </p>
        </div>
        
        <button
          onClick={onCancel}
          className={`p-1 px-3 rounded transition-colors flex items-center gap-1.5 focus:outline-none ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-700 hover:text-slate-900'}`}
        >
          <X className="w-4 h-4" />
          <span className="text-xs font-bold font-mono">CANCELAR</span>
        </button>
      </div>

      {/* Main Dialog body */}
      <div className={`flex-1 border-x border-b shadow p-4 overflow-auto rounded-b flex flex-col min-h-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        
        {/* Step 1: Customer & Vehicle Information Form */}
        {step === 1 ? (
          <form onSubmit={handleGoToItems} className="flex-1 flex flex-col justify-between min-h-0 gap-4">
            <div className={`grid grid-cols-1 md:grid-cols-6 gap-3 text-[11px] font-semibold overflow-y-auto pr-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              
              {/* Row 1 */}
              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">Orçamento</label>
                <input
                  type="text"
                  readOnly
                  value={nextId}
                  className={`w-full border p-1.5 px-2 font-bold mt-1 outline-none font-mono text-center ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-blue-400' : 'bg-slate-100 border-slate-300 text-blue-600'}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block uppercase tracking-tight text-[10px]">Cliente *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo do cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-bold mt-1 outline-none rounded focus:ring-1 uppercase ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">CPF / CNPJ</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">Telefone</label>
                <input
                  type="text"
                  placeholder="(51) 90000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">E-mail</label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              {/* Row 2: Address Block */}
              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">CEP</label>
                <input
                  type="text"
                  placeholder="90000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block uppercase tracking-tight text-[10px]">Rua / Logradouro</label>
                <input
                  type="text"
                  placeholder="Ex: R. Veador Porto"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">Número / Compl.</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Nº"
                    value={numero}
                    aria-label="Número do endereço"
                    onChange={(e) => setNumero(e.target.value)}
                    className={`w-20 border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                  />
                  <input
                    type="text"
                    placeholder="Compl."
                    value={complemento}
                    aria-label="Complemento"
                    onChange={(e) => setComplemento(e.target.value)}
                    className={`flex-1 border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">Bairro</label>
                <input
                  type="text"
                  placeholder="Ex: Partenon"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">Cidade</label>
                <input
                  type="text"
                  placeholder="Ex: Porto Alegre"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              {/* Row 3: Car details */}
              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: HONDA"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-bold mt-1 outline-none rounded focus:ring-1 uppercase placeholder-slate-500 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block uppercase tracking-tight text-[10px]">Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: FIT"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-bold mt-1 outline-none rounded focus:ring-1 uppercase placeholder-slate-500 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">Placa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: IZP4C38"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-bold tracking-widest mt-1 outline-none rounded focus:ring-1 uppercase font-mono placeholder-slate-500 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">Ano</label>
                <input
                  type="text"
                  placeholder="Ex: 2020"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 font-mono ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">KM</label>
                <input
                  type="text"
                  placeholder="Ex: 85000"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 font-mono ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              {/* Observation Detail */}
              <div className="md:col-span-6">
                <label className="block uppercase tracking-tight text-[10px]">Detalhes / Observações adicionais</label>
                <textarea
                  placeholder="Descreva aqui observações do recebimento, avarias pré-existentes ou detalhes gerais..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className={`w-full border p-2 font-medium mt-1 outline-none rounded focus:ring-1 resize-none h-14 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>
            </div>

            {/* Bottom Panel Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-500 pt-3">
              <div className="md:col-span-2">
                <button
                  id="btn_ir_itens"
                  type="submit"
                  className="w-full py-3 bg-[#00a2ff] hover:bg-[#008be0] text-white font-extrabold rounded shadow-lg transition-transform transform active:scale-95 flex justify-center items-center gap-2 border-b-2 border-blue-700"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="uppercase tracking-widest text-xs">Ir para os Itens do Orçamento</span>
                </button>
              </div>

              <div className="md:col-span-1 bg-[#42444c] border border-neutral-500 p-2 text-center rounded flex items-center justify-between">
                <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-tight ml-2">Valor Total:</span>
                <span className="text-xl font-bold font-mono text-white mr-2">R$ 0,00</span>
              </div>
            </div>
          </form>
        ) : (
          /* Step 2: Service Items List Editor */
          <div className="flex-1 flex flex-col justify-between min-h-0 gap-4">
            
            {/* Split Top section - Read Only Info summary */}
            <div className={`p-3 text-xs rounded border grid grid-cols-1 md:grid-cols-3 gap-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
              <div>
                <span className={`font-bold block text-[9px] uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Cliente:</span>
                <span className="font-bold uppercase truncate">{clientName}</span>
              </div>
              <div>
                <span className={`font-bold block text-[9px] uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Veículo:</span>
                <span className="font-bold uppercase truncate">{marca} {modelo}</span>
              </div>
              <div>
                <span className={`font-bold block text-[9px] uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Placa:</span>
                <span className="font-mono font-bold uppercase">{placa}</span>
              </div>
            </div>

            {/* Observation Detail */}
            <div className={`p-4 border rounded ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <label className="block uppercase tracking-tight text-[10px] mb-1 font-bold">Detalhes / Observações adicionais</label>
                <textarea
                  placeholder="Descreva aqui observações do recebimento, avarias pré-existentes ou detalhes gerais..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className={`w-full border p-2 font-medium outline-none rounded focus:ring-1 resize-none h-14 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
            </div>

            {/* Dynamic Items addition section */}
            <div className={`flex-1 flex flex-col min-h-0 border rounded p-3 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              
              <form onSubmit={handleAddItem} className={`p-3 rounded-t border-b flex flex-col md:flex-row gap-3 items-end ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                <div className="flex-1">
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    Nome / Descrição do Serviço ou Peça
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TROCA E PINTURA DO PARACHOQUE TRASEIRO"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className={`w-full border p-1.5 text-xs font-bold rounded outline-none uppercase ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
                  />
                </div>
                
                <div className="w-full md:w-40">
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                    Valor Cobrado (R$)
                  </label>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={itemValue}
                    onChange={(e) => setItemValue(e.target.value)}
                    className={`w-full border p-1.5 text-xs font-mono font-bold rounded text-right outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
                  />
                </div>

                <button
                  id="btn_incluir_item"
                  type="submit"
                  className="w-full md:w-28 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded shadow flex justify-center items-center gap-1 shadow transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Incluir</span>
                </button>
              </form>

              {/* Items List Table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`font-bold text-[10px] uppercase tracking-wider border-b ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-600'}`}>
                      <th className="px-3 py-2 border-r border-slate-300/20">Item</th>
                      <th className="px-3 py-2 border-r border-slate-300/20">Descrição do Serviço / Peça</th>
                      <th className="px-3 py-2 text-right w-36 border-r border-slate-300/20">Valor</th>
                      <th className="px-3 py-2 text-center w-20">Ações</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-700/40 text-white' : 'divide-slate-200 text-slate-800'} font-semibold`}>
                    {items.length > 0 ? (
                      items.map((it, idx) => (
                        <tr key={it.id} className={`hover:opacity-80 ${theme === 'dark' ? 'bg-slate-900/40' : 'bg-slate-50'}`}>
                          <td className={`px-3 py-2 border-r border-slate-300/20 text-center w-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-mono`}>
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2 border-r border-slate-300/20 uppercase">
                            {it.name}
                          </td>
                          <td className={`px-3 py-2 border-r border-slate-300/20 text-right font-mono ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                            R$ {it.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              id={`delete_item_btn_${idx}`}
                              type="button"
                              onClick={() => handleRemoveItem(it.id)}
                              className={`p-1 rounded transition-colors ${theme === 'dark' ? 'text-red-400 hover:text-red-300 hover:bg-slate-800' : 'text-red-600 hover:text-red-700 hover:bg-slate-200'}`}
                              title="Remover serviço"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-neutral-300 font-medium italic">
                          Nenhum serviço incluído ainda. Digite um serviço acima e clique em Incluir.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-neutral-500 pt-3 shrink-0">
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-neutral-600 hover:bg-neutral-500 text-white text-xs font-extrabold rounded shadow uppercase tracking-wider"
                >
                  Voltar ao veículo
                </button>

                <button
                  id="btn_gravar_orcamento"
                  type="button"
                  onClick={handleSaveBudget}
                  className="flex-1 py-3 bg-[#4caf50] hover:bg-[#43a047] text-white text-xs font-extrabold rounded shadow-lg flex justify-center items-center gap-2 border-b-2 border-green-700 uppercase tracking-widest"
                >
                  <Save className="w-4 h-4" />
                  <span>Gravar e Avançar</span>
                </button>
              </div>

              <div className="md:col-span-1 bg-[#42444c] border border-neutral-500 p-2 text-center rounded flex items-center justify-between">
                <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-tight ml-2">Valor Total:</span>
                <span className="text-xl font-bold font-mono text-[#4ade80] mr-2">R$ {formattedTotal}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
