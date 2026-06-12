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

export default function BudgetForm({ nextId, onSave, onCancel }: BudgetFormProps) {
  const { theme } = useTheme();
  const [step, setStep] = useState<1 | 2>(1);

  // Form Inputs
  const [clientName, setClientName] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');

  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [ano, setAno] = useState('');
  const [km, setKm] = useState('');
  const [details, setDetails] = useState('');

  // Step 2 Item creation Inputs
  const [items, setItems] = useState<ServiceItem[]>([]);
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
      id: nextId,
      createdAt: dateStr,
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
      {/* Dialogue Header */}
      <div className={`p-4 rounded-t border-t border-x shadow flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
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
      <div className={`flex-1 border-x border-b shadow p-4 overflow-auto rounded-b flex flex-col min-h-0 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
        
        {/* Step 1: Customer & Vehicle Information Form */}
        {step === 1 ? (
          <form onSubmit={handleGoToItems} className="flex-1 flex flex-col justify-between min-h-0 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-white text-[11px] font-semibold overflow-y-auto pr-1">
              
              {/* Row 1 */}
              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Orçamento</label>
                <input
                  type="text"
                  readOnly
                  value={nextId}
                  className={`w-full border p-1.5 px-2 font-bold mt-1 outline-none font-mono text-center ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-blue-400' : 'bg-slate-100 border-slate-300 text-blue-600'}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Cliente *</label>
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
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">CPF / CNPJ</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Telefone</label>
                <input
                  type="text"
                  placeholder="(51) 90000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff]"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">E-mail</label>
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff]"
                />
              </div>

              {/* Row 2: Address Block */}
              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">CEP</label>
                <input
                  type="text"
                  placeholder="90000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Rua / Logradouro</label>
                <input
                  type="text"
                  placeholder="Ex: R. Veador Porto"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff]"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Número / Compl.</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Nº"
                    value={numero}
                    aria-label="Número do endereço"
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-20 bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff]"
                  />
                  <input
                    type="text"
                    placeholder="Compl."
                    value={complemento}
                    aria-label="Complemento"
                    onChange={(e) => setComplemento(e.target.value)}
                    className="flex-1 bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff]"
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Bairro</label>
                <input
                  type="text"
                  placeholder="Ex: Partenon"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff]"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Cidade</label>
                <input
                  type="text"
                  placeholder="Ex: Porto Alegre"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff]"
                />
              </div>

              {/* Row 3: Car details */}
              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: HONDA"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-bold mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff] uppercase placeholder-neutral-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: FIT"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-bold mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff] uppercase placeholder-neutral-400"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Placa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: IZP4C38"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-bold tracking-widest mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff] uppercase font-mono placeholder-neutral-400"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Ano</label>
                <input
                  type="text"
                  placeholder="Ex: 2020"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff] font-mono"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">KM</label>
                <input
                  type="text"
                  placeholder="Ex: 85000"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  className="w-full bg-[#ffffff] border border-neutral-400 p-1.5 px-2 text-neutral-800 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff] font-mono"
                />
              </div>

              {/* Observation Detail */}
              <div className="md:col-span-6">
                <label className="block text-neutral-300 uppercase tracking-tight text-[10px]">Detalhes / Observações adicionais</label>
                <textarea
                  placeholder="Descreva aqui observações do recebimento, avarias pré-existentes ou detalhes gerais..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-[#ffffff] border border-[#a1a1a1] p-2 text-neutral-800 placeholder-neutral-400 font-medium mt-1 outline-none rounded focus:ring-1 focus:ring-[#00a2ff] resize-none h-14"
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
            <div className="bg-[#484a50] p-3 text-white text-xs rounded border border-neutral-500 grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <span className="text-neutral-300 font-bold block text-[9px] uppercase">Cliente:</span>
                <span className="font-bold uppercase text-[#bde0fe] truncate">{clientName}</span>
              </div>
              <div>
                <span className="text-neutral-300 font-bold block text-[9px] uppercase">Veículo:</span>
                <span className="font-bold uppercase truncate">{marca} {modelo}</span>
              </div>
              <div>
                <span className="text-neutral-300 font-bold block text-[9px] uppercase">Placa:</span>
                <span className="font-mono font-bold uppercase text-[#00a2ff]">{placa}</span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-neutral-600 hover:bg-neutral-500 text-neutral-100 p-0.5 px-2 rounded-full font-bold text-[9px] uppercase border border-neutral-400 mt-1"
                >
                  Alterar dados do veículo
                </button>
              </div>
            </div>

            {/* Dynamic Items addition section */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#5c5f66] border border-neutral-500 p-3 rounded">
              
              <form onSubmit={handleAddItem} className="bg-[#4f5158] p-3 rounded-t border-b border-neutral-600 flex flex-col md:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-[#00a2ff] uppercase tracking-wider mb-1">
                    Nome / Descrição do Serviço ou Peça
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: TROCA E PINTURA DO PARACHOQUE TRASEIRO"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full bg-white border border-neutral-400 text-neutral-800 p-1.5 text-xs font-bold rounded outline-none uppercase placeholder-neutral-400"
                  />
                </div>
                
                <div className="w-full md:w-40">
                  <label className="block text-[10px] font-bold text-[#00a2ff] uppercase tracking-wider mb-1">
                    Valor Cobrado (R$)
                  </label>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={itemValue}
                    onChange={(e) => setItemValue(e.target.value)}
                    className="w-full bg-white border border-neutral-400 text-neutral-800 p-1.5 text-xs font-mono font-bold rounded text-right outline-none"
                  />
                </div>

                <button
                  id="btn_incluir_item"
                  type="submit"
                  className="w-full md:w-28 py-1.5 bg-[#4caf50] hover:bg-[#43a047] text-white font-bold text-xs rounded shadow flex justify-center items-center gap-1 shadow transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Incluir</span>
                </button>
              </form>

              {/* Items List Table */}
              <div className="flex-1 overflow-auto bg-[#6a6e77]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#43454b] text-neutral-300 font-bold text-[10px] uppercase tracking-wider border-b border-neutral-500">
                      <th className="px-3 py-2 border-r border-[#616161]">Item</th>
                      <th className="px-3 py-2 border-r border-[#616161]">Descrição do Serviço / Peça</th>
                      <th className="px-3 py-2 text-right w-36 border-r border-[#616161]">Valor</th>
                      <th className="px-3 py-2 text-center w-20">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-500/40 text-white font-semibold">
                    {items.length > 0 ? (
                      items.map((it, idx) => (
                        <tr key={it.id} className="hover:bg-neutral-600/30 text-white even:bg-[#5e6169]/30">
                          <td className="px-3 py-2 border-r border-[#616161]/80 text-[#00a2ff] font-mono text-center w-12">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2 border-r border-[#616161]/80 uppercase">
                            {it.name}
                          </td>
                          <td className="px-3 py-2 border-r border-[#616161]/80 text-right font-mono text-[#54eb7c]">
                            R$ {it.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              id={`delete_item_btn_${idx}`}
                              type="button"
                              onClick={() => handleRemoveItem(it.id)}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-neutral-600 rounded transition-colors"
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
