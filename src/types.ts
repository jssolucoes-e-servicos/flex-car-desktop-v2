export interface ServiceItem {
  id: string;
  name: string;
  value: number;
}

export type BudgetStatus = 'PENDENTE' | 'APROVADO' | 'EM_ANDAMENTO' | 'FINALIZADO';

export interface Budget {
  id: number;
  createdAt: string;
  clientName: string;
  document: string;
  phone: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  marca: string;
  modelo: string;
  placa: string;
  ano: string;
  km: string;
  details: string;
  items: ServiceItem[];
  totalValue: number;
  status: BudgetStatus;
  approved: boolean;
}

export interface Receipt {
  id: number;
  recipientName: string;
  document: string;
  receiptType: 'RECEBIMENTO' | 'PAGAMENTO';
  value: number;
  valueExtenso: string;
  description: string;
  createdAt: string;
  reverso: 'SIM' | 'NÃO';
  paymentMethod: string;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  login: string;
  profile: string;
  active: boolean;
}

export type MainTab = 'Atendimento' | 'Cadastros';
export type AtendimentoSubTab = 'Orçamentos' | 'Recibos' | 'Usuários';
