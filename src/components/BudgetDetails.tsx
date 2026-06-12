import React from 'react';
import { Budget } from '../types';
import { Phone, FileText, ArrowLeft, Send, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BudgetDetailsProps {
  budget: Budget;
  onBack: () => void;
  onPrint: () => void;
  onEdit?: (budget: Budget) => void;
  onApprove?: (id: number) => void;
  onStatusUpdate?: (id: number, status: string) => void;
}

export default function BudgetDetails({ budget, onBack, onPrint, onEdit, onApprove, onStatusUpdate }: BudgetDetailsProps) {
  const { theme } = useTheme();
  
  // Format currency
  const formatMoney = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Simulate sending WhatsApp message matching the screen layout action
  const handleWhatsappSend = () => {
    const text = `Olá ${budget.clientName}, o orçamento nº ${budget.id} para o veículo ${budget.marca} ${budget.modelo} (${budget.placa}) ficou pronto no valor total de ${formatMoney(budget.totalValue)}.`;
    const phoneClean = budget.phone ? budget.phone.replace(/\D/g, '') : '51983099462'; // fallback phone
    const url = `https://api.whatsapp.com/send?phone=55${phoneClean}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const statusColors = {
    'PENDENTE': theme === 'dark' ? 'bg-amber-900/30 text-amber-500 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-200',
    'APROVADO': theme === 'dark' ? 'bg-emerald-900/30 text-emerald-500 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'EM_ANDAMENTO': theme === 'dark' ? 'bg-blue-900/30 text-blue-500 border-blue-800' : 'bg-blue-100 text-blue-800 border-blue-200',
    'FINALIZADO': theme === 'dark' ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-200 text-slate-700 border-slate-300',
  };

  return (
    <div className={`flex-1 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'} flex flex-col h-full overflow-hidden select-text font-sans p-3`}>
      {/* Simulation Dialog Header */}
      <div className={`p-4 rounded-t border-t border-x shadow flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
        <div>
          <h2 className={`text-lg font-black tracking-wide uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            Detalhes do Orçamento
          </h2>
          <p className={`text-xs font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
            de número: # {budget.id}
          </p>
        </div>
        
        <button
          onClick={onBack}
          aria-label="Voltar para a listagem"
          className={`p-1 px-3 rounded transition-colors flex items-center gap-1.5 focus:outline-none ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-700 hover:text-slate-900'}`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold">FECHAR</span>
        </button>
      </div>

      {/* Main Content Pane inside dialog container */}
      <div className={`flex-1 border-x border-b shadow p-4 overflow-auto space-y-4 rounded-b ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
        
        {/* Fields Area */}
        <div className={`grid grid-cols-1 md:grid-cols-6 gap-3 text-[11px] font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          
          {/* Row 1 */}
          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">Cadastrado em</span>
            <input
              type="text"
              readOnly
              value={budget.createdAt}
              className={`w-full border p-1 px-2 font-bold mt-1 outline-none font-mono ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-blue-400' : 'bg-slate-200 border-slate-300 text-blue-600'}`}
            />
          </div>

          <div className="md:col-span-2">
            <span className="block uppercase tracking-tight text-[10px]">Cliente</span>
            <input
              type="text"
              readOnly
              value={budget.clientName}
              className={`w-full border p-1 px-2 font-bold mt-1 outline-none uppercase ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-blue-300' : 'bg-slate-200 border-slate-300 text-slate-900'}`}
            />
          </div>

          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">Documento</span>
            <input
              type="text"
              readOnly
              value={budget.document || '<< Não informado >>'}
              className={`w-full border p-1 px-2 mt-1 outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>

          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">Telefone</span>
            <input
              type="text"
              readOnly
              value={budget.phone || '<< Não informado >>'}
              className={`w-full border p-1 px-2 mt-1 outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>

          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">E-mail</span>
            <input
              type="text"
              readOnly
              value={budget.email || '<< Não informado >>'}
              className={`w-full border p-1 px-2 mt-1 outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>

          {/* Row 2 - Address Block */}
          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">CEP</span>
            <input
              type="text"
              readOnly
              value={budget.cep || '<< Não informado >>'}
              className={`w-full border p-1 px-2 mt-1 outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>

          <div className="md:col-span-2">
            <span className="block uppercase tracking-tight text-[10px]">Rua</span>
            <input
              type="text"
              readOnly
              value={budget.rua || '<< Não informado >>'}
              className={`w-full border p-1 px-2 mt-1 outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>

          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">Número / Compl.</span>
            <input
              type="text"
              readOnly
              value={`${budget.numero || '-'} ${budget.complemento ? ' / ' + budget.complemento : ''}`}
              className={`w-full border p-1 px-2 mt-1 outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>

          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">Bairro</span>
            <input
              type="text"
              readOnly
              value={budget.bairro || '<< Não informado >>'}
              className={`w-full border p-1 px-2 mt-1 outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>

          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">Cidade</span>
            <input
              type="text"
              readOnly
              value={budget.cidade || '<< Não informado >>'}
              className={`w-full border p-1 px-2 mt-1 outline-none ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>

          {/* Row 3 - Car Block */}
          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">Marca</span>
            <input
              type="text"
              readOnly
              value={budget.marca}
              className={`w-full border p-1 px-2 font-bold mt-1 outline-none uppercase ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-blue-400' : 'bg-slate-200 border-slate-300 text-blue-700'}`}
            />
          </div>

          <div className="md:col-span-2">
            <span className="block uppercase tracking-tight text-[10px]">Modelo</span>
            <input
              type="text"
              readOnly
              value={budget.modelo}
              className={`w-full border p-1 px-2 font-bold mt-1 outline-none uppercase ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-blue-400' : 'bg-slate-200 border-slate-300 text-blue-700'}`}
            />
          </div>

          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">Placa</span>
            <input
              type="text"
              readOnly
              value={budget.placa}
              className={`w-full border p-1 px-2 font-bold tracking-widest mt-1 outline-none uppercase font-mono ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-blue-400' : 'bg-slate-200 border-slate-300 text-blue-700'}`}
            />
          </div>

          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">Ano</span>
            <input
              type="text"
              readOnly
              value={budget.ano}
              className={`w-full border p-1 px-2 mt-1 outline-none font-mono ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>

          <div className="md:col-span-1">
            <span className="block uppercase tracking-tight text-[10px]">KM</span>
            <input
              type="text"
              readOnly
              value={budget.km || '-'}
              className={`w-full border p-1 px-2 mt-1 outline-none font-mono ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>

          {/* Details/Observations */}
          <div className="md:col-span-6">
            <span className="block uppercase tracking-tight text-[10px]">Detalhes / Observações adicionais</span>
            <textarea
              readOnly
              value={budget.details || 'Sem especificações adicionais.'}
              className={`w-full border p-2 mt-1 outline-none resize-none h-14 ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-200 border-slate-300'}`}
            />
          </div>
        </div>

        {/* Lower Grid: Services Table Left, Big Box Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          
          {/* Services Table List */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <span>Itens do Orçamento</span>
              <span className="bg-neutral-500 text-neutral-100 text-[10px] py-0.5 px-1.5 rounded-full font-mono">
                {budget.items.length} itens
              </span>
            </h4>
            
            <div className="bg-[#5a5d65] border border-neutral-500 rounded overflow-hidden max-h-[220px] overflow-y-auto">
              <table className="w-full text-left text-xs text-white border-collapse">
                <thead>
                  <tr className="bg-[#484a50] text-[#00a2ff] font-bold text-[10px] uppercase border-b border-neutral-500">
                    <th className="px-3 py-2 border-r border-neutral-500">Descrição do Serviço / Peça</th>
                    <th className="px-3 py-2 text-right w-36">Valor Cobrado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-500/40">
                  {budget.items.map((it) => (
                    <tr key={it.id} className="hover:bg-neutral-600/40 font-semibold even:bg-[#5f626a]/30">
                      <td className="px-3 py-2 border-r border-neutral-500 uppercase text-neutral-100">
                        {it.name}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-[#4ade80]">
                        {it.value === 0 
                          ? 'R$ 0,00' 
                          : formatMoney(it.value)
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Print & Whatsapp trigger row */}
            <div className="flex gap-2.5 mt-3">
              <button
                id="btn_whatsapp"
                onClick={handleWhatsappSend}
                className="flex-1 py-2.5 bg-[#25d366] hover:bg-[#20ba56] text-white text-xs font-bold rounded shadow flex items-center justify-center gap-2 transition-transform transform active:scale-95 border-b-2 border-green-700"
              >
                <Phone className="w-4 h-4 fill-white stroke-none" />
                <span className="uppercase tracking-widest text-[11px]">Enviar WhatsApp</span>
              </button>

              <button
                id="btn_gerar_pdf"
                onClick={onPrint}
                className="flex-1 py-2.5 bg-[#d32f2f] hover:bg-[#c2185b] text-white text-xs font-bold rounded shadow flex items-center justify-center gap-2 transition-transform transform active:scale-95 border-b-2 border-red-800"
              >
                <FileText className="w-4 h-4" />
                <span className="uppercase tracking-widest text-[11px]">Gerar PDF / Imprimir</span>
              </button>
            </div>
          </div>

          {/* Big Total Value display rectangle */}
          <div className="lg:col-span-1 bg-[#42444c] border border-neutral-500 p-4 rounded flex flex-col justify-between items-center text-center shadow">
            <div className="w-full">
              <span className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest block border-b border-neutral-600 pb-1 mr-1">
                Resumo De Cobrança
              </span>
            </div>

            <div className="my-6">
              <span className="block text-xs text-neutral-400 font-medium uppercase tracking-tight">Valor Total:</span>
              <span id="valor_total_text" className="block text-3xl font-black text-white font-mono tracking-tight mt-1">
                {formatMoney(budget.totalValue)}
              </span>
            </div>

            {/* Actions: Approve / Edit */}
            <div className="w-full flex flex-col gap-2 pt-4 border-t border-neutral-600">
              {!budget.approved && (
                <button
                  onClick={() => onEdit && onEdit(budget)}
                  className="w-full py-2 bg-slate-600 hover:bg-slate-500 rounded text-white text-xs font-bold uppercase tracking-widest"
                >
                  Editar Orçamento
                </button>
              )}
              
              {!budget.approved && (
                <button
                  onClick={() => onApprove && onApprove(budget.id)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white text-xs font-bold uppercase tracking-widest"
                >
                  Aprovar Orçamento
                </button>
              )}
            </div>

          {/* Quick status decoration checkmark */}
          {budget.approved && (
            <div className={`text-[10px] font-bold p-1 px-3 rounded-full flex items-center gap-1.5 uppercase font-mono tracking-wider border ${statusColors[budget.status]}`}>
              <Check className="w-3.5 h-3.5 border-2 rounded-full p-0.5" />                
              <select
                value={budget.status}
                onChange={(e) => onStatusUpdate && onStatusUpdate(budget.id, e.target.value)}
                className={`bg-transparent outline-none cursor-pointer ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}
              >
                  <option value="PENDENTE">Pendente</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="FINALIZADO">Finalizado</option>
              </select>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
