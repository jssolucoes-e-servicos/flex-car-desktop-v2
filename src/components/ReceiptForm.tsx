import React, { useState } from 'react';
import { Receipt } from '../types';
import { Save, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ReceiptFormProps {
  nextId: number;
  onSave: (newReceipt: Receipt) => void;
  onCancel: () => void;
}

// Simple dynamic Portuguese "written-out number" (Valor por extenso) generator
function writeSumInPortuguese(value: number): string {
  if (value <= 0) return 'ZERO REAIS';
  
  const unidades = ['', 'UM', 'DOIS', 'TRÊS', 'QUATRO', 'CINCO', 'SEIS', 'SETE', 'OITO', 'NOVE'];
  const dezenas10_19 = ['DEZ', 'ONZE', 'DOZE', 'TREZE', 'CATORZE', 'QUINZE', 'DEZESSEIS', 'DEZESSETE', 'DEZOITO', 'DEZENOVE'];
  const dezenas = ['', '', 'VINTE', 'TRINTA', 'QUARENTA', 'CINCOENTA', 'SESSENTA', 'SETENTA', 'OITENTA', 'NOVENTA'];
  const centenas = ['', 'CENTO', 'DUZENTOS', 'TREZENTOS', 'QUATROCENTOS', 'QUINCENTOS', 'SEISCENTOS', 'SETECENTOS', 'OITENTOS', 'NOVECENTOS'];

  const getCentenaStr = (n: number) => {
    if (n === 100) return 'CEM';
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;
    
    let str = centenas[c];
    if (d > 0 || u > 0) {
      if (str) str += ' E ';
      if (d === 1) {
        str += dezenas10_19[u];
      } else {
        if (d > 1) {
          str += dezenas[d];
          if (u > 0) str += ' E ' + unidades[u];
        } else if (u > 0) {
          str += unidades[u];
        }
      }
    }
    return str;
  };

  const integerPart = Math.floor(value);
  const centsPart = Math.round((value - integerPart) * 100);

  let parts: string[] = [];

  if (integerPart > 0) {
    if (integerPart < 1000) {
      parts.push(getCentenaStr(integerPart) + (integerPart === 1 ? ' REAL' : ' REAIS'));
    } else if (integerPart < 1000000) {
      const milhar = Math.floor(integerPart / 1000);
      const resto = integerPart % 1000;
      
      let milharStr = '';
      if (milhar > 1) {
        milharStr = getCentenaStr(milhar) + ' ';
      }
      milharStr += 'MIL';
      
      if (resto > 0) {
        milharStr += ' E ' + getCentenaStr(resto);
      }
      
      parts.push(milharStr + ' REAIS');
    } else {
      parts.push(integerPart.toLocaleString('pt-BR') + ' REAIS');
    }
  }

  if (centsPart > 0) {
    let centsStr = '';
    if (centsPart < 10) {
      centsStr = unidades[centsPart];
    } else if (centsPart < 20) {
      centsStr = dezenas10_19[centsPart - 10];
    } else {
      const d = Math.floor(centsPart / 10);
      const u = centsPart % 10;
      centsStr = dezenas[d];
      if (u > 0) centsStr += ' E ' + unidades[u];
    }
    parts.push(centsStr + (centsPart === 1 ? ' CENTAVO' : ' CENTAVOS'));
  }

  return parts.join(' E ');
}

export default function ReceiptForm({ nextId, onSave, onCancel }: ReceiptFormProps) {
  const { theme } = useTheme();
  const [recipientName, setRecipientName] = useState('');
  const [document, setDocument] = useState('');
  const [receiptType, setReceiptType] = useState<'RECEBIMENTO' | 'PAGAMENTO'>('RECEBIMENTO');
  const [valueStr, setValueStr] = useState('');
  const [valueExtenso, setValueExtenso] = useState('');
  const [description, setDescription] = useState('');

  // Handle value change to auto-calculate the Portuguese description
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    setValueStr(rawInput);
    
    const cleanNum = parseFloat(rawInput.replace(',', '.')) || 0;
    if (cleanNum > 0) {
      const extensoResult = writeSumInPortuguese(cleanNum);
      setValueExtenso(extensoResult.toUpperCase());
    } else {
      setValueExtenso('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      alert('Por favor, indique o Nome do Recebedor!');
      return;
    }
    
    const valueNum = parseFloat(valueStr.replace(',', '.')) || 0;
    if (valueNum <= 0) {
      alert('Informe um valor superior a R$ 0,00!');
      return;
    }

    const today = new Date();
    // format DD/MM/YYYY às HH:MM
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const yearToday = today.getFullYear();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const dateStr = `${day}/${month}/${yearToday} às ${hours}:${minutes}`;

    onSave({
      id: nextId,
      recipientName: recipientName.toUpperCase(),
      document,
      receiptType,
      value: valueNum,
      valueExtenso: valueExtenso || writeSumInPortuguese(valueNum).toUpperCase(),
      description: description.toUpperCase() || 'SERVIÇOS DE CHAPEAÇÃO E PINTURA DE VEÍCULO',
      createdAt: dateStr,
      reverso: 'NÃO',
      paymentMethod: 'DINHEIRO',
    });
  };

  return (
    <div className={`flex-1 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'} flex flex-col h-full overflow-hidden select-text font-sans p-3`}>
      {/* Dialogue Header */}
      <div className={`p-4 rounded-t border-t border-x shadow flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}`}>
        <div>
          <h2 className={`text-lg font-black tracking-wide uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            Novo Recibo
          </h2>
          <p className={`text-xs font-bold uppercase ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
            Criação de novo recibo de caixa
          </p>
        </div>
        
        <button
          onClick={onCancel}
          className={`p-1 px-3 rounded transition-colors flex items-center gap-1.5 focus:outline-none ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-700 hover:text-slate-900'}`}
        >
          <X className="w-4 h-4" />
          <span className="text-xs font-bold font-mono">FECHAR</span>
        </button>
      </div>

      {/* Main Dialog body */}
      <form onSubmit={handleSubmit} className={`flex-1 border-x border-b shadow p-5 overflow-auto rounded-b flex flex-col justify-between gap-5 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}>
        
        <div className="space-y-4">
          
          {/* Section: Dados do Pagador / Recebedor */}
          <div className={`border rounded p-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 border-b pb-1 ${theme === 'dark' ? 'text-blue-400 border-slate-700' : 'text-blue-600 border-slate-200'}`}>
              Dados do Pagador / Recebedor
            </h3>
            
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <div className="md:col-span-2">
                <label className="block uppercase tracking-tight text-[10px]">Nome *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: LORENZO ANGRIZANI"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-bold mt-1 outline-none rounded uppercase focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">CPF / CNPJ (Apenas números)</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  className={`w-full border p-1.5 px-2 font-medium mt-1 outline-none rounded focus:ring-1 font-mono ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">Tipo de Recibo</label>
                <select
                  value={receiptType}
                  onChange={(e) => setReceiptType(e.target.value as any)}
                  className={`w-full border p-1.5 px-2 font-bold mt-1 h-[29px] outline-none rounded text-xs focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 focus:ring-blue-500'}`}
                >
                  <option value="RECEBIMENTO">RECEBIMENTO</option>
                  <option value="PAGAMENTO">PAGAMENTO / ENTRADA</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Dados do Recibo */}
          <div className={`border rounded p-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 border-b pb-1 ${theme === 'dark' ? 'text-blue-400 border-slate-700' : 'text-blue-600 border-slate-200'}`}>
              Dados do Recibo de Valor
            </h3>

            <div className={`grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <div className="md:col-span-1">
                <label className="block uppercase tracking-tight text-[10px]">Valor (R$) *</label>
                <input
                  type="text"
                  required
                  placeholder="0,00"
                  value={valueStr}
                  onChange={handleValueChange}
                  className={`w-full border p-1.5 px-2 font-bold mt-1 outline-none rounded font-mono focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>

              <div className="md:col-span-3">
                <label className="block uppercase tracking-tight text-[10px]">Valor por extenso</label>
                <input
                  type="text"
                  readOnly
                  placeholder="Gerado automaticamente..."
                  value={valueExtenso}
                  className={`w-full border p-1.5 px-2 font-bold mt-1 outline-none rounded font-mono uppercase ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-blue-400' : 'bg-slate-100 border-slate-300 text-blue-600'}`}
                />
              </div>

              <div className="md:col-span-4">
                <label className="block uppercase tracking-tight text-[10px]">Descrição do Recibo</label>
                <textarea
                  placeholder="Ex: SERVIÇOS DE CHAPEAÇÃO E REPARO DO PARACHOQUE DIANTEIRO DO VEÍCULO HONDA HRV"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full border p-2 font-semibold mt-1 outline-none rounded h-16 uppercase resize-none focus:ring-1 ${theme === 'dark' ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-600 focus:ring-blue-900' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:ring-blue-500'}`}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Action button bar */}
        <div className="flex gap-4 border-t border-neutral-500 pt-3 shrink-0">
          <button
            type="submit"
            className="flex-1 py-3 bg-[#4caf50] hover:bg-[#43a047] text-white font-extrabold rounded shadow-lg flex justify-center items-center gap-2 border-b-2 border-green-700 uppercase tracking-widest text-xs"
          >
            <Save className="w-4 h-4" />
            <span>Gravar Recibo</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-neutral-600 hover:bg-neutral-500 text-white font-extrabold rounded shadow uppercase tracking-wider text-xs"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}
