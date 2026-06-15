import React, { useState, useMemo } from 'react';
import { Save, X, Plus, Trash2, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Budget, PaymentMethod, Receipt } from '../types';

interface PaymentEntry {
  id: string;
  amount: number;
  method: PaymentMethod;
  installments?: number;
}

interface PaymentFormProps {
  budget: Budget;
  onSave: (payments: PaymentEntry[], receipts: Receipt[]) => void;
  onCancel: () => void;
  nextReceiptId: number;
}

export default function PaymentForm({ budget, onSave, onCancel, nextReceiptId }: PaymentFormProps) {
  const { theme } = useTheme();
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('DINHEIRO');
  const [installments, setInstallments] = useState(1);
  const [showAuth, setShowAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const totalPaid = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);
  const remaining = budget.totalValue - totalPaid;

  const handleAddPayment = () => {
    const valueNum = parseFloat(amount.replace(',', '.')) || 0;
    if (valueNum <= 0) return;

    const newPayment: PaymentEntry = {
      id: Math.random().toString(),
      amount: valueNum,
      method,
      installments: method === 'CARTAO_CREDITO_PARCELADO' ? installments : undefined,
    };

    setPayments([...payments, newPayment]);
    setAmount('');
  };

  const handleRemovePayment = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
  };

  const handleFinish = (isForced = false) => {
    if (!isForced && payments.length === 0) {
      setShowAuth(true);
      return;
    }

    if (isForced && password !== 'admin') {
      setError('Senha incorreta!');
      return;
    }

    // Generate receipts for all payments
    const today = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const receipts: Receipt[] = payments.map((p, index) => ({
      id: nextReceiptId + index,
      recipientName: budget.clientName,
      document: budget.document,
      receiptType: 'RECEBIMENTO',
      value: p.amount,
      valueExtenso: '', // Simplified as needed
      description: `Pagamento de Orçamento #${budget.id} - ${p.method}`,
      createdAt: today,
      reverso: 'NÃO',
      paymentMethod: p.method,
    }));

    onSave(payments, receipts);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm`}>
      <div className={`w-full max-w-2xl rounded-2xl shadow-xl flex flex-col ${theme === 'dark' ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'}`}>
        <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className="text-xl font-bold">Controle Financeiro - Orçamento #{budget.id}</h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-500/20 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-auto">
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <p className="font-bold flex justify-between"><span>Valor Total:</span> <span>R$ {budget.totalValue.toFixed(2)}</span></p>
            <p className="font-bold flex justify-between text-blue-500"><span>Já Pago:</span> <span>R$ {totalPaid.toFixed(2)}</span></p>
            <p className="font-bold flex justify-between text-green-500"><span>Saldo Restante:</span> <span>R$ {remaining.toFixed(2)}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Valor (R$)" value={amount} onChange={(e) => setAmount(e.target.value)} className={`p-2 rounded border ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'}`} />
            <select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)} className={`p-2 rounded border ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'}`}>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="PIX">PIX</option>
              <option value="CARTAO_DEBITO">Débito</option>
              <option value="CARTAO_CREDITO_AVISTA">Crédito à vista</option>
              <option value="CARTAO_CREDITO_PARCELADO">Crédito parcelado</option>
            </select>
            {method === 'CARTAO_CREDITO_PARCELADO' && (
              <input type="number" min="2" placeholder="Parcelas" value={installments} onChange={(e) => setInstallments(parseInt(e.target.value))} className={`p-2 rounded border ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'}`} />
            )}
            <button onClick={handleAddPayment} className="col-span-2 bg-blue-600 text-white rounded p-2 flex items-center justify-center gap-2 font-bold"><Plus className="w-4 h-4" /> Incluir Pagamento</button>
          </div>

          <div className="space-y-2">
            {payments.map(p => (
              <div key={p.id} className={`p-3 rounded flex justify-between items-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <span>{p.method} - R$ {p.amount.toFixed(2)} {p.installments ? `(${p.installments}x)` : ''}</span>
                <button onClick={() => handleRemovePayment(p.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 border-t flex justify-end gap-3 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
          <button onClick={onCancel} className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>Cancelar</button>
          <button onClick={() => handleFinish(false)} className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold flex items-center gap-2"><Check className="w-4 h-4" /> Concluir e Aprovar</button>
        </div>
      </div>

      {showAuth && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`p-6 rounded-2xl shadow-xl w-full max-w-sm ${theme === 'dark' ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'}`}>
            <h3 className="text-lg font-bold mb-4">Autorizar sem pagamento</h3>
            <p className="text-sm mb-4">Insira a senha do administrador para prosseguir sem pagamentos.</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full p-2 rounded border mb-2 ${theme === 'dark' ? 'bg-slate-950 border-slate-700' : 'bg-slate-50 border-slate-300'}`} placeholder="Senha" />
            {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
            <div className="flex justify-end gap-3">
                <button onClick={() => setShowAuth(false)} className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>Cancelar</button>
                <button onClick={() => handleFinish(true)} className="px-6 py-2 rounded-lg bg-red-600 text-white font-bold">Autorizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
