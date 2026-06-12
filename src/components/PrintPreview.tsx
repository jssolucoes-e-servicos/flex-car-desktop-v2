import React from 'react';
import { Budget, Receipt } from '../types';
import { Printer, X, Download } from 'lucide-react';

interface PrintPreviewProps {
  budget?: Budget;
  receipt?: Receipt;
  onClose: () => void;
}

export default function PrintPreview({ budget, receipt, onClose }: PrintPreviewProps) {
  
  const handlePrint = () => {
    window.print();
  };

  const formatMoney = (val: number) => {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto p-4 flex flex-col items-center select-text font-serif print:p-0 print:bg-white print:static">
      
      {/* Top action toolbar (hidden during actual browser print) */}
      <div className="w-full max-w-4xl bg-[#42444c] text-white p-3 rounded-t border border-neutral-600 shadow-lg flex items-center justify-between shrink-0 mb-2 print:hidden font-sans">
        <div className="flex items-center gap-2">
          <span className="bg-[#00a2ff] text-[10px] uppercase font-bold py-0.5 px-2 rounded-full font-mono">
            Modo de Impressão
          </span>
          <span className="text-xs font-bold font-mono">
            {budget ? `Orçamento nº ${budget.id}` : `Recibo nº ${receipt?.id}`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-[#4caf50] hover:bg-[#43a047] text-white font-extrabold rounded shadow flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>IMPRIMIR</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-600 hover:bg-neutral-500 text-white font-extrabold rounded shadow flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
            <span>FECHAR</span>
          </button>
        </div>
      </div>

      {/* Embedded print-only CSS injection to format A4 exactly and hide extra details */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .print-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Editable simulated A4 sheet */}
      <div className="print-container w-full max-w-[800px] bg-white text-black p-8 md:p-12 shadow-2xl border border-neutral-300 relative min-h-[1100px] flex flex-col justify-between animate-fade-in print:shadow-none print:border-none">
        
        {/* Render BUDGET (ORÇAMENTO) report sheet */}
        {budget && (
          <div className="flex flex-col flex-1">
            {/* Header Box */}
            <div className="flex justify-between items-start border-b-2 border-neutral-300 pb-3 h-24">
              {/* Logo Section */}
              <div className="flex items-center gap-3">
                {/* Red Car Contours inline vector */}
                <div className="w-16 h-12 text-[#e60000] shrink-0 font-sans font-black flex items-center justify-center">
                  <svg viewBox="0 0 100 50" className="w-full h-full fill-none stroke-current stroke-[3.5]">
                    {/* Retro line design from screenshot */}
                    <path d="M 5 35 Q 20 20, 35 15 T 70 12 Q 85 15, 95 30 L 95 38 L 5 38 Z" />
                    <path d="M 5 28 L 95 28 M 30 18 Q 45 42, 70 42" stroke="black" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#e60000] font-sans leading-none flex items-baseline gap-1">
                    <span className="text-3xl font-black">DL</span> 
                    <span className="text-xs tracking-widest font-black text-neutral-800">CHAPEAÇÃO E PINTURA</span>
                  </h1>
                  <p className="text-[10px] text-neutral-500 font-sans mt-1 leading-normal">
                    Razão Social: CPOM - REGISTRO ATIVO<br />
                    Endereço: R. Veador Porto, 717, Partenon, Porto Alegre
                  </p>
                </div>
              </div>

              {/* Right CNPJ / Contact details */}
              <div className="text-right text-[10px] text-neutral-800 font-sans space-y-0.5 leading-tight pt-1">
                <p><span className="font-bold">CNPJ:</span> 66.925.976/0001-83</p>
                <p><span className="font-bold">Telefone:</span> (51) 98309-9462</p>
                <p><span className="font-bold">Emissor:</span> JSSOLUCOES</p>
              </div>
            </div>

            {/* Document Title Panel */}
            <div className="flex items-stretch border-2 border-neutral-300 mt-4 rounded-sm text-sm overflow-hidden font-sans">
              <div className="flex-1 p-3 flex items-center justify-center bg-neutral-50">
                <h2 className="text-2xl font-black tracking-widest text-neutral-800 uppercase">
                  Orçamento
                </h2>
              </div>
              <div className="w-44 border-l-2 border-neutral-300 bg-white p-2 text-center flex flex-col justify-center leading-normal">
                <p className="text-[10px] text-neutral-500 font-bold uppercase">Orc. Nº</p>
                <p className="text-lg font-black text-neutral-800 font-mono tracking-wide">
                  {budget.id}
                </p>
                <p className="text-[9px] text-neutral-400 font-bold mt-1 uppercase">Emissão</p>
                <p className="text-[9px] font-bold text-neutral-700 font-mono">
                  {budget.createdAt}
                </p>
              </div>
            </div>

            {/* Client Info Block */}
            <div className="border border-neutral-300 rounded-sm mt-4 p-3 font-sans text-xs space-y-1 bg-neutral-50/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><span className="font-bold text-neutral-500 uppercase tracking-tight mr-1 text-[10px]">Cliente:</span> <span className="font-bold text-neutral-900">{budget.clientName}</span></p>
                <p><span className="font-bold text-neutral-500 uppercase tracking-tight mr-1 text-[10px]">Documento:</span> <span className="text-neutral-800">{budget.document || '<< Não informado >>'}</span></p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <p><span className="font-bold text-neutral-500 uppercase tracking-tight mr-1 text-[10px]">E-mail:</span> <span className="text-neutral-800">{budget.email || '<< Não informado >>'}</span></p>
                <p><span className="font-bold text-neutral-500 uppercase tracking-tight mr-1 text-[10px]">Telefone:</span> <span className="text-neutral-800 font-mono">{budget.phone || '<< Não informado >>'}</span></p>
              </div>
              <p><span className="font-bold text-neutral-500 uppercase tracking-tight mr-1 text-[10px]">Endereço:</span> <span className="text-neutral-800">{budget.rua ? `${budget.rua}, ${budget.numero} ${budget.bairro} - ${budget.cidade}` : '<< Não informado >>'}</span></p>
            </div>

            {/* Vehicle Details Box (Horizontal items) */}
            <div className="grid grid-cols-5 gap-2 mt-4 font-sans text-xs text-center">
              <div className="border border-neutral-300 p-1.5 rounded bg-[#fcfcfc]">
                <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold mb-0.5">Marca</span>
                <span className="font-bold text-neutral-800 uppercase">{budget.marca}</span>
              </div>
              <div className="border border-neutral-300 p-1.5 rounded bg-[#fcfcfc]">
                <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold mb-0.5">Modelo</span>
                <span className="font-bold text-neutral-800 uppercase">{budget.modelo}</span>
              </div>
              <div className="border border-neutral-300 p-1.5 rounded bg-[#fcfcfc]">
                <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold mb-0.5">Placa</span>
                <span className="font-bold text-neutral-800 uppercase font-mono">{budget.placa}</span>
              </div>
              <div className="border border-neutral-300 p-1.5 rounded bg-[#fcfcfc]">
                <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold mb-0.5">Ano</span>
                <span className="font-bold text-neutral-800 font-mono">{budget.ano}</span>
              </div>
              <div className="border border-neutral-300 p-1.5 rounded bg-[#fcfcfc]">
                <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold mb-0.5">KM</span>
                <span className="font-bold text-neutral-800 font-mono">{budget.km || '-'}</span>
              </div>
            </div>

            {/* Notes Section if any */}
            {budget.details && (
              <div className="border border-neutral-300 rounded-sm mt-3 p-2 text-[10px] font-sans text-neutral-600">
                <span className="font-bold uppercase text-[9px] text-neutral-400 block tracking-wider mb-0.5">Observações:</span>
                <p className="italic">{budget.details}</p>
              </div>
            )}

            {/* Item Table Grid */}
            <div className="mt-5 flex-1">
              <h3 className="text-center font-bold font-sans text-xs uppercase tracking-widest text-neutral-700 mb-2 border-b-2 border-neutral-200 pb-1">
                Itens do Orçamento
              </h3>
              
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-neutral-300 text-[10px] text-neutral-500 font-bold uppercase tracking-wide">
                    <th className="py-1">Descrição</th>
                    <th className="py-1 text-right w-36">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-800 font-medium">
                  {budget.items.map((it) => (
                    <tr key={it.id}>
                      <td className="py-2.5 uppercase">{it.name}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-neutral-900">
                        {it.value === 0 ? 'R$ 0,00' : `R$ ${formatMoney(it.value)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Block & Authentication footer */}
            <div className="border-t-2 border-neutral-300 pt-3 mt-6">
              <div className="flex justify-end items-center font-sans">
                <div className="border-2 border-neutral-800 rounded px-5 py-2 flex items-center gap-4 bg-neutral-50">
                  <span className="text-xs font-black uppercase tracking-wider text-neutral-600">Total</span>
                  <span className="text-xl font-black font-mono text-neutral-900">
                    R$ {formatMoney(budget.totalValue)}
                  </span>
                </div>
              </div>

              {/* Signatures and QR authentication */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 font-sans text-[10px] text-neutral-500 leading-normal border-t border-neutral-200 pt-8">
                {/* Sign line */}
                <div className="flex flex-col justify-end items-center pt-8 text-center">
                  <div className="w-56 border-b border-neutral-600 mb-1"></div>
                  <p className="font-bold uppercase text-neutral-800">{budget.clientName}</p>
                  <p>Autorização de Execução</p>
                </div>

                {/* Authenticator vector block */}
                <div className="border border-neutral-300 p-2.5 rounded flex items-center gap-3 bg-neutral-50">
                  {/* Generated QR vector drawing */}
                  <div className="w-12 h-12 text-neutral-700 shrink-0 select-none">
                    <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
                      <rect x="2" y="2" width="10" height="10" />
                      <rect x="28" y="2" width="10" height="10" />
                      <rect x="2" y="28" width="10" height="10" />
                      <rect x="6" y="6" width="2" height="2" className="fill-white" />
                      <rect x="32" y="6" width="2" height="2" className="fill-white" />
                      <rect x="6" y="32" width="2" height="2" className="fill-white" />
                      {/* Random blocks */}
                      <rect x="16" y="4" width="4" height="4" />
                      <rect x="22" y="8" width="4" height="4" />
                      <rect x="14" y="20" width="8" height="4" />
                      <rect x="18" y="28" width="4" height="8" />
                      <rect x="28" y="22" width="6" height="4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800 uppercase text-[8px] tracking-widest block mb-0.5">CHAVE DE AUTENTICAÇÃO</h4>
                    <p className="font-mono text-[9px] text-[#257be7] font-bold">
                      {`{00A307A5-3E2D-4C8E-B213-${(budget.id + 1000).toString(16).toUpperCase().padStart(4, '0')}F11088C}`}
                    </p>
                    <p className="font-mono text-[8px] text-neutral-400">
                      0df1bde3-808b-4ae8-ba41-aa0c809d06c2
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Render RECEIPT (RECIBO) report sheet */}
        {receipt && (
          <div className="flex flex-col flex-1 divide-y divide-dashed divide-neutral-400 gap-8">
            
            {/* Copy 1: Via do estabelecimento */}
            <div className="pb-8">
              <ReceiptSection receipt={receipt} formatMoney={formatMoney} docCopyTitle="VIA DO ESTABELECIMENTO" />
            </div>

            {/* Copy 2: Via do cliente */}
            <div className="pt-8 flex-1">
              <ReceiptSection receipt={receipt} formatMoney={formatMoney} docCopyTitle="VIA DO CLIENTE" />
            </div>

          </div>
        )}

        {/* Global Footer standard credits representing real system paper logs */}
        <div className="mt-8 pt-4 border-t border-neutral-300 flex justify-between font-sans text-[8px] text-neutral-400 select-none print:mt-4">
          <span>JS Soluções e Serviços - www.jssolucoeseservicos.com.br | jssolucoeseservicos@gmail.com</span>
          <span className="font-mono">Pág. 1 de 1</span>
        </div>

      </div>
    </div>
  );
}

// Inner helper component for repeating receipt formatting twice
interface ReceiptSectionProps {
  receipt: Receipt;
  docCopyTitle: string;
  formatMoney: (val: number) => string;
}

function ReceiptSection({ receipt, formatMoney, docCopyTitle }: ReceiptSectionProps) {
  return (
    <div className="font-sans">
      {/* Header Box */}
      <div className="flex justify-between items-start pb-3 border-b-2 border-neutral-300 h-[65px]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-9 text-[#e60000] shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 50" className="w-full h-full fill-none stroke-current stroke-[4]">
              <path d="M 5 35 Q 20 20, 35 15 T 70 12 Q 85 15, 95 30 L 95 38 L 5 38 Z" />
              <path d="M 5 28 L 95 28" stroke="black" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <h1 className="text-md font-bold tracking-tight text-[#e60000] leading-none flex items-baseline gap-1">
              <span className="text-xl font-black">DL</span> 
              <span className="text-[10px] tracking-widest font-black text-neutral-800">CHAPEAÇÃO E PINTURA</span>
            </h1>
            <p className="text-[9px] text-neutral-500 mt-0.5 leading-snug">
              R. Veador Porto, 717, Partenon, Porto Alegre • Tel: (51) 98309-9462
            </p>
          </div>
        </div>

        <div className="text-right text-[9px] text-neutral-700 pt-0.5 font-semibold">
          <p>CNPJ: 66.925.976/0001-83</p>
          <p className="text-[#e21b1b] font-bold mt-0.5 uppercase tracking-wide font-mono text-[8px]">{docCopyTitle}</p>
        </div>
      </div>

      {/* Recibo Titles Block style */}
      <div className="flex items-stretch border border-neutral-300 mt-3 rounded-sm overflow-hidden text-xs">
        <div className="flex-1 p-2 flex items-center justify-center bg-neutral-50 border-r border-neutral-300">
          <h2 className="text-lg font-black tracking-widest text-[#00a2ff] uppercase">
            Recibo
          </h2>
        </div>
        <div className="w-36 p-1.5 text-center flex flex-col justify-center leading-snug">
          <p className="text-[8px] text-neutral-400 font-bold uppercase">Número</p>
          <p className="text-md font-bold font-mono text-neutral-800">
            {receipt.id}
          </p>
        </div>
      </div>

      {/* Receivables core structured letter form text block */}
      <div className="border border-neutral-300 rounded-sm mt-3 p-4 bg-[#fcfcfc] space-y-3 leading-normal text-xs text-neutral-800">
        
        {/* Row 1 Beneficiary details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-2 border-b border-neutral-100">
          <p><span className="text-[9px] uppercase tracking-wide text-neutral-400 block font-bold">Recebi(mos) de:</span> <span className="font-bold text-neutral-900 text-sm uppercase">{receipt.recipientName}</span></p>
          <p><span className="text-[9px] uppercase tracking-wide text-neutral-400 block font-bold">Documento CPF / CNPJ:</span> <span className="font-medium font-mono text-neutral-900">{receipt.document || '<< Não informado >>'}</span></p>
        </div>

        {/* Row 2: Value numeric & fully written out details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-1">
          <div className="md:col-span-1 bg-neutral-100 border border-neutral-200 p-2 rounded text-center">
            <span className="block text-[8px] uppercase tracking-wide text-neutral-400 font-bold mb-0.5">Valor do Recibo:</span>
            <span className="text-lg font-black text-[#00a2ff] font-mono leading-none">
              R$ {formatMoney(receipt.value)}
            </span>
          </div>

          <div className="md:col-span-2">
            <span className="block text-[8px] uppercase tracking-wide text-neutral-400 font-bold mb-0.5">Valor por extenso:</span>
            <p className="font-bold text-neutral-900 text-[11px] leading-tight font-serif uppercase tracking-tight">
              {receipt.valueExtenso}
            </p>
          </div>
        </div>

        {/* Row 3: Description details */}
        <div className="pt-2 border-t border-neutral-100">
          <span className="block text-[8px] uppercase tracking-wide text-neutral-400 font-bold mb-0.5">Referente a:</span>
          <p className="bg-[#f0f4f8] text-neutral-700 italic p-2.5 rounded font-medium border border-neutral-200 text-xs uppercase leading-relaxed">
            {receipt.description}
          </p>
        </div>
      </div>

      {/* Signature Section / QRCode block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-[9px] text-neutral-500 font-sans leading-normal">
        {/* Left authenticator block */}
        <div className="border border-neutral-300 p-2 rounded flex items-center gap-2 bg-neutral-50">
          <div className="w-10 h-10 text-neutral-600 shrink-0">
            <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
              <rect x="2" y="2" width="10" height="10" />
              <rect x="28" y="2" width="10" height="10" />
              <rect x="2" y="28" width="10" height="10" />
              <rect x="6" y="6" width="2" height="2" className="fill-white" />
              <rect x="32" y="6" width="2" height="2" className="fill-white" />
              <rect x="6" y="32" width="2" height="2" className="fill-white" />
              <rect x="14" y="6" width="4" height="4" />
              <rect x="18" y="18" width="8" height="4" />
              <rect x="28" y="28" width="8" height="8" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-neutral-800 text-[8px] uppercase leading-none mb-0.5">CHAVE DE AUTENTICAÇÃO</h4>
            <p className="font-mono text-[8px] text-neutral-700">
              {`{62CE450C-21EC-4935-ADD4-${(receipt.id + 1000).toString(16).toUpperCase().padStart(4, '0')}C6A1}`}
            </p>
            <p className="font-mono text-[8px] text-neutral-400 leading-none">
              0df1bde3-808b-4ae8-ba41-aa0c809d06c2
            </p>
          </div>
        </div>

        {/* Right signature details */}
        <div className="flex flex-col justify-end items-center text-center">
          <div className="w-48 border-b border-neutral-500 mb-0.5"></div>
          <p className="font-bold text-neutral-800 uppercase text-[10px] leading-tight">{receipt.recipientName}</p>
          <p className="text-[8px] text-neutral-400 font-mono mt-0.5">Data de emissão: {receipt.createdAt}</p>
        </div>
      </div>
    </div>
  );
}
