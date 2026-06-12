import React, { useState, useEffect } from 'react';
import { Budget, Receipt, User, MainTab, AtendimentoSubTab } from './types';
import { seedBudgets, seedReceipts, seedUsers } from './data/seedData';
import { useTheme } from './context/ThemeContext';

// Component imports
import LoginScreen from './components/LoginScreen';
import BudgetList from './components/BudgetList';
import BudgetDetails from './components/BudgetDetails';
import BudgetForm from './components/BudgetForm';
import ReceiptList from './components/ReceiptList';
import ReceiptForm from './components/ReceiptForm';
import UserList from './components/UserList';
import UserProfile from './components/UserProfile';
import CompanySettings from './components/CompanySettings';
import PrintPreview from './components/PrintPreview';
import SplashScreen from './components/SplashScreen';

// Icon imports
import { 
  Users, 
  FileText, 
  DollarSign, 
  Plus, 
  List, 
  LogOut, 
  X, 
  Building,
} from 'lucide-react';

export default function App() {
  const { theme } = useTheme();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [modalComponent, setModalComponent] = useState<React.ReactNode | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  // Login Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appClosed, setAppClosed] = useState(false);

  // Core Arrays State
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [users, setUsers] = useState<User[]>(seedUsers);

  // Navigation state
  const [activeTab, setActiveTab] = useState<MainTab>('Atendimento');
  const [activeSubTab, setActiveSubTab] = useState<AtendimentoSubTab>('Orçamentos');
  const [activeView, setActiveView] = useState<'home' | 'orçamentos_lista' | 'recibos_lista' | 'usuarios_lista'>('home');

  // Detail View and Print overlay states
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [printBudget, setPrintBudget] = useState<Budget | null>(null);
  const [printReceipt, setPrintReceipt] = useState<Receipt | null>(null);

  // Close Application (Logout) modal confirmations
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Save updates helper
  const handleSaveBudgets = (updatedList: Budget[]) => {
    setBudgets(updatedList);
    localStorage.setItem('flexcar_budgets', JSON.stringify(updatedList));
  };

  const handleSaveReceipts = (updatedList: Receipt[]) => {
    setReceipts(updatedList);
    localStorage.setItem('flexcar_receipts', JSON.stringify(updatedList));
  };

  // Load state from local storage on mount
  useEffect(() => {
    const localBudgets = localStorage.getItem('flexcar_budgets');
    const localReceipts = localStorage.getItem('flexcar_receipts');

    if (localBudgets) {
      try {
        setBudgets(JSON.parse(localBudgets));
      } catch (e) {
        setBudgets(seedBudgets);
      }
    } else {
      setBudgets(seedBudgets);
      localStorage.setItem('flexcar_budgets', JSON.stringify(seedBudgets));
    }

    if (localReceipts) {
      try {
        setReceipts(JSON.parse(localReceipts));
      } catch (e) {
        setReceipts(seedReceipts);
      }
    } else {
      setReceipts(seedReceipts);
      localStorage.setItem('flexcar_receipts', JSON.stringify(seedReceipts));
    }
  }, []);

  // Keyboard shortcut listener for authentic Delphi feel (ESC to cancel/close stuff)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showExitConfirm) {
          setShowExitConfirm(false);
        } else if (printBudget || printReceipt) {
          setPrintBudget(null);
          setPrintReceipt(null);
        } else if (selectedBudget) {
          setSelectedBudget(null);
        } else if (activeView === 'orçamento_novo' || activeView === 'recibo_novo') {
          setActiveView('home');
        }
      } else if (e.key === 'Enter') {
        if (showExitConfirm) {
          handleLogout();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showExitConfirm, printBudget, printReceipt, selectedBudget, activeView]);

  // Action handlers
  const handleLogout = () => {
    setCurrentUser(null);
    setShowExitConfirm(false);
    setActiveView('home');
    setSelectedBudget(null);
  };

  // Budget operations
  const saveNewBudget = (newBudget: Budget) => {
    const updated = [newBudget, ...budgets];
    handleSaveBudgets(updated);
    
    setActiveTab('Atendimento');                
    setActiveSubTab('Orçamentos');
    setActiveView('orçamentos_lista');

    setModalComponent(<BudgetDetails 
      budget={newBudget} 
      onBack={() => { setModalComponent(null); }} 
      onPrint={() => { setPrintBudget(newBudget); setModalComponent(null); }}
      onEdit={(budgetToEdit) => {
        setModalComponent(
          <BudgetForm 
            nextId={budgetToEdit.id} 
            budgetToEdit={budgetToEdit}
            onSave={(updatedBudget) => {
              const updatedBudgets = budgets.map(b => b.id === updatedBudget.id ? updatedBudget : b);
              handleSaveBudgets(updatedBudgets);
              setModalComponent(null);
            }} 
            onCancel={() => setModalComponent(null)} 
          />
        );
      }}
      onApprove={(id) => {
        const updatedBudgets = budgets.map(b => b.id === id ? { ...b, approved: true } : b);
        handleSaveBudgets(updatedBudgets);
        setModalComponent(null);
      }}
      onStatusUpdate={(id, newStatus) => {
        const updatedBudgets = budgets.map(b => b.id === id ? { ...b, status: newStatus as any } : b);
        handleSaveBudgets(updatedBudgets);
        setModalComponent(null);
      }}
    />);
  };

  // Receipt operations
  const saveNewReceipt = (newReceipt: Receipt) => {
    const updated = [newReceipt, ...receipts];
    handleSaveReceipts(updated);
    setActiveSubTab('Recibos');
    setActiveView('recibos_lista');
    // Auto trigger print for newly created receipt
    setPrintReceipt(newReceipt);
  };

  const getNextBudgetId = () => {
    if (budgets.length === 0) return 1;
    return Math.max(...budgets.map((b) => b.id)) + 1;
  };

  const getNextReceiptId = () => {
    if (receipts.length === 0) return 1;
    return Math.max(...receipts.map((r) => r.id)) + 1;
  };

  // Render App if not authenticated
  if (isAppLoading) {
    return <SplashScreen />;
  }

  if (appClosed) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <div className={`p-8 rounded-2xl text-center ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
              <h2 className="text-2xl font-bold">Sessão Encerrada</h2>
              <p className="mt-2 text-slate-500">Você saiu do sistema.</p>
          </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} overflow-hidden transition-colors`} id="app_frame">
      
      {/* Sidebar Navigation */}
      <aside className={`w-64 border-r ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} flex flex-col shrink-0`}>
        <div className="p-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">FC</div>
            <h1 className="font-bold text-xl tracking-tight">flex<span className="text-blue-600">Car</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
            <button
                onClick={() => { setActiveTab('Atendimento'); setActiveSubTab('Orçamentos'); setActiveView('home'); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeView === 'home' ? 'bg-blue-600 text-white' : `${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}`}
            >
                <Building className="w-5 h-5" />
                Início
            </button>
            <button
                onClick={() => { setActiveTab('Atendimento'); setActiveSubTab('Orçamentos'); setActiveView('orçamentos_lista'); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeView === 'orçamentos_lista' ? 'bg-blue-600 text-white' : `${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}`}
            >
                <FileText className="w-5 h-5" />
                Orçamentos
            </button>
            <button
                onClick={() => { setActiveTab('Atendimento'); setActiveSubTab('Recibos'); setActiveView('recibos_lista'); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeTab === 'Atendimento' && activeSubTab === 'Recibos' ? 'bg-blue-600 text-white' : `${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}`}
            >
                <DollarSign className="w-5 h-5" />
                Recibos
            </button>
            <div className={`pt-4 pb-2 px-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>Cadastros</div>
            <button
                onClick={() => { setActiveTab('Cadastros'); setActiveSubTab('Usuários'); setActiveView('usuarios_lista'); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeView === 'usuarios_lista' ? 'bg-blue-600 text-white' : `${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}`}
            >
                <Users className="w-5 h-5" />
                Usuários
            </button>
        </nav>

        <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} space-y-2`}>
            <button
                onClick={() => setModalComponent(<UserProfile user={currentUser} onCancel={() => setModalComponent(null)} />)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
            >
                <Users className="w-5 h-5" />
                Meu Perfil
            </button>
            <button
                onClick={() => setModalComponent(<CompanySettings onCancel={() => setModalComponent(null)} />)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
            >
                <Building className="w-5 h-5" />
                Empresa
            </button>
            <button
                onClick={() => setShowExitConfirm(true)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-red-900/40 hover:text-red-400' : 'text-slate-600 hover:bg-red-50 hover:text-red-600'}`}
                title="Sair do Sistema"
            >
                <LogOut className="w-5 h-5" />
                Sair
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-16 border-b flex items-center justify-between px-8 shrink-0 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <h2 className="font-semibold text-lg">
             {activeView === 'home' ? 'Painel Inicial' : 
              activeView === 'orçamentos_lista' ? 'Listagem de Orçamentos' :
              activeView === 'recibos_lista' ? 'Listagem de Recibos' :
              activeView === 'usuarios_lista' ? 'Gerenciamento de Usuários' : 'Sistema'}
          </h2>
        </header>

        <main className="flex-1 overflow-y-auto">
          {activeView === 'home' && (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center" id="dashboard_home_screen">
               <div className={`p-12 rounded-2xl shadow-sm border max-w-lg ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <Building className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Bem-vindo ao flexCar</h2>
                  <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} mb-6 font-medium`}>Selecione uma opção no menu lateral para começar a gerenciar seus orçamentos e recibos.</p>
               </div>
            </div>
          )}

          {activeView === 'orçamentos_lista' && (
            <BudgetList
              budgets={budgets}
              onSelectBudget={(b) => setModalComponent(<BudgetDetails 
                  budget={b} 
                  onBack={() => { setModalComponent(null); }} 
                  onPrint={() => { setPrintBudget(b); setModalComponent(null); }}
                  onEdit={(budgetToEdit) => {
                    setModalComponent(
                      <BudgetForm 
                        nextId={budgetToEdit.id} 
                        budgetToEdit={budgetToEdit}
                        onSave={(updatedBudget) => {
                          const updated = budgets.map(b => b.id === updatedBudget.id ? updatedBudget : b);
                          handleSaveBudgets(updated);
                          setModalComponent(null);
                        }} 
                        onCancel={() => setModalComponent(null)} 
                      />
                    );
                  }}
                  onApprove={(id) => {
                    const updated = budgets.map(b => b.id === id ? { ...b, approved: true } : b);
                    handleSaveBudgets(updated);
                    setModalComponent(null);
                  }}
                  onStatusUpdate={(id, newStatus) => {
                    const updated = budgets.map(b => b.id === id ? { ...b, status: newStatus as any } : b);
                    handleSaveBudgets(updated);
                    setModalComponent(null);
                  }}
                />)}
              onNewBudget={() => setModalComponent(<BudgetForm nextId={getNextBudgetId()} onSave={(b) => { saveNewBudget(b); }} onCancel={() => setModalComponent(null)} />)}
              onPrintBudget={(b) => setPrintBudget(b)}
            />
          )}

          {activeView === 'recibos_lista' && (
            <ReceiptList
              receipts={receipts}
              onSelectReceipt={(r) => setPrintReceipt(r)}
              onNewReceipt={() => setModalComponent(<ReceiptForm nextId={getNextReceiptId()} onSave={(r) => { saveNewReceipt(r); setModalComponent(null); }} onCancel={() => setModalComponent(null)} />)}
              onPrintReceipt={(r) => setPrintReceipt(r)}
            />
          )}

          {activeView === 'usuarios_lista' && (
            <UserList 
              users={users} 
              onPrintList={() => alert('Listagem de usuários enviada com sucesso para a impressora!')}
            />
          )}
        </main>
      </div>

      {/* Modal Layer */}
      {modalComponent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
              <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                  {modalComponent}
              </div>
          </div>
      )}

      {/* Print Preview */}
      {(printBudget || printReceipt) && (
        <PrintPreview
          budget={printBudget || undefined}
          receipt={printReceipt || undefined}
          onClose={() => { setPrintBudget(null); setPrintReceipt(null); }}
        />
      )}

      {/* Logout Confirmation */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
            <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Sair do Sistema?</h3>
                <p className={`mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Tem certeza que deseja sair?</p>
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowExitConfirm(false)} className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>Não</button>
                    <button onClick={() => { setShowExitConfirm(false); setAppClosed(true); }} className="px-4 py-2 rounded-lg bg-red-600 text-white">Sim</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
