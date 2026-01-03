import React, { useState } from 'react';
import { LayoutDashboard, Server, Settings as SettingsIcon, Radar, Bell, Search, User, Globe } from 'lucide-react';
import { GlobalDashboard } from './pages/GlobalDashboard';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Discovery } from './pages/Discovery';
import { Settings } from './pages/Settings';

type View = 'global_dashboard' | 'company_dashboard' | 'inventory' | 'discovery' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('global_dashboard');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(undefined);

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setCurrentView('company_dashboard');
  };

  const handleBackToGlobal = () => {
    setSelectedCompanyId(undefined);
    setCurrentView('global_dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'global_dashboard': 
        return <GlobalDashboard onSelectCompany={handleSelectCompany} />;
      case 'company_dashboard': 
        return <Dashboard companyId={selectedCompanyId} onBack={handleBackToGlobal} />;
      case 'inventory': 
        return <Inventory companyId={selectedCompanyId} onBack={selectedCompanyId ? handleBackToGlobal : undefined} />;
      case 'discovery': 
        return <Discovery />; // Discovery usually happens at Agent level, but we keep UI here
      case 'settings': 
        return <Settings />;
      default: 
        return <GlobalDashboard onSelectCompany={handleSelectCompany} />;
    }
  };

  const NavItem = ({ view, icon, label, isActive, onClick }: { view?: View; icon: React.ReactNode; label: string; isActive?: boolean; onClick?: () => void }) => (
    <button
      onClick={onClick ? onClick : () => view && setCurrentView(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1
        ${(isActive || currentView === view)
          ? 'bg-blue-50 text-blue-600 font-medium' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-800">Sentinel IP</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 font-medium px-1">Super Admin (Central)</div>
        </div>

        <nav className="flex-1 px-4 py-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Gestão</div>
          
          <NavItem 
            icon={<Globe size={20} />} 
            label="Visão Global" 
            isActive={currentView === 'global_dashboard'}
            onClick={handleBackToGlobal}
          />
          
          {selectedCompanyId && (
             <NavItem 
                view="company_dashboard" 
                icon={<LayoutDashboard size={20} />} 
                label="Painel da Empresa" 
             />
          )}

          <NavItem view="inventory" icon={<Server size={20} />} label={selectedCompanyId ? "Inventário (Empresa)" : "Inventário Global"} />
          
          {!selectedCompanyId && (
            <NavItem view="discovery" icon={<Radar size={20} />} label="Descoberta (Agente)" />
          )}
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6 px-4">Sistema</div>
          <NavItem view="settings" icon={<SettingsIcon size={20} />} label="Configurações" />
        </nav>

        <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-lg p-3 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center">
                    <User size={16} />
                </div>
                <div className="overflow-hidden">
                    <div className="text-sm font-medium text-slate-700 truncate">Super Admin</div>
                    <div className="text-xs text-slate-500 truncate">master@sentinel.com</div>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 z-10">
            <div className="flex items-center md:hidden">
                 <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                    <ShieldCheckIcon className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-slate-800">Sentinel</span>
            </div>

            {/* Context Indicator */}
            <div className="hidden md:flex items-center text-sm font-medium text-slate-500">
                {selectedCompanyId ? (
                    <>
                        <span onClick={handleBackToGlobal} className="cursor-pointer hover:text-blue-600">Central Global</span>
                        <span className="mx-2">/</span>
                        <span className="text-slate-800">Cliente Selecionado</span>
                    </>
                ) : (
                    <span className="text-slate-800">Visão Central Unificada</span>
                )}
            </div>

            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {renderContent()}
            </div>
        </main>
      </div>
    </div>
  );
}

// Icon helper
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
