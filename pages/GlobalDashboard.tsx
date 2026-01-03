import React from 'react';
import { Users, AlertTriangle, Activity, MapPin, Server } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { MOCK_COMPANIES, MOCK_ALERTS } from '../constants';

interface GlobalDashboardProps {
  onSelectCompany: (companyId: string) => void;
}

export const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ onSelectCompany }) => {
  const totalCompanies = MOCK_COMPANIES.length;
  const companiesWithIssues = MOCK_COMPANIES.filter(c => c.status !== 'HEALTHY').length;
  const totalCriticalAlerts = MOCK_ALERTS.filter(a => a.severity === 'CRITICAL').length;
  const agentsOnline = MOCK_COMPANIES.filter(c => c.agentStatus === 'CONNECTED').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Central de Operações (Super Admin)</h2>
          <p className="text-slate-500 mt-1">Visão global de todos os clientes de locação e agentes remotos.</p>
        </div>
        <div className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-mono flex items-center">
          <Server size={16} className="mr-2 text-green-400" />
          Server IP: 177.153.50.82
        </div>
      </div>

      {/* KPI Global */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Clientes" 
          value={totalCompanies} 
          icon={<Users size={24} />} 
          color="blue"
        />
        <StatCard 
          title="Clientes com Alertas" 
          value={companiesWithIssues} 
          icon={<AlertTriangle size={24} />} 
          color="orange"
        />
        <StatCard 
          title="Alertas Críticos Globais" 
          value={totalCriticalAlerts} 
          icon={<Activity size={24} />} 
          color="red"
        />
        <StatCard 
          title="Agentes Online" 
          value={`${agentsOnline}/${totalCompanies}`} 
          icon={<MapPin size={24} />} 
          color={agentsOnline === totalCompanies ? 'green' : 'red'}
        />
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mt-4">Status por Empresa (Agente Remoto)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COMPANIES.map(company => (
          <div 
            key={company.id} 
            onClick={() => onSelectCompany(company.id)}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md transition-all hover:border-blue-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
                <Users className="text-slate-600 group-hover:text-blue-600" size={20} />
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold border ${
                company.status === 'HEALTHY' ? 'bg-green-50 text-green-700 border-green-200' :
                company.status === 'WARNING' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-red-50 text-red-700 border-red-200'
              }`}>
                {company.status === 'HEALTHY' ? 'SAUDÁVEL' : company.status}
              </span>
            </div>
            
            <h4 className="font-bold text-slate-800 text-lg mb-1">{company.name}</h4>
            <p className="text-slate-500 text-xs mb-4">Doc: {company.document}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Agente Remoto:</span>
                <span className={`font-medium ${company.agentStatus === 'CONNECTED' ? 'text-green-600' : 'text-red-600'}`}>
                  {company.agentStatus === 'CONNECTED' ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dispositivos:</span>
                <span className="font-medium text-slate-800">{company.totalDevices}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-slate-500">Contato:</span>
                 <span className="font-medium text-slate-800">{company.contact}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <span className="text-blue-600 text-sm font-medium hover:underline">Acessar Painel Detalhado &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
