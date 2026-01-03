import React, { useEffect, useState } from 'react';
import { Users, AlertTriangle, Activity, MapPin, Server, Loader2, Database } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { api } from '../services/api';
import { Company, Alert } from '../types';

interface GlobalDashboardProps {
  onSelectCompany: (companyId: string) => void;
}

export const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ onSelectCompany }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // API now handles fallbacks to Mock data, so we don't need extensive try/catch for connection errors here
      const [companiesData, alertsData] = await Promise.all([
        api.getCompanies(),
        api.getAlerts()
      ]);
      setCompanies(companiesData);
      setAlerts(alertsData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center flex-col">
        <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500">Sincronizando dados...</p>
      </div>
    );
  }

  const totalCompanies = companies.length;
  const companiesWithIssues = companies.filter(c => c.status !== 'HEALTHY').length;
  const totalCriticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
  const agentsOnline = companies.filter(c => c.agentStatus === 'CONNECTED').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Central de Operações (Super Admin)</h2>
          <p className="text-slate-500 mt-1">Visão global de todos os clientes de locação e agentes remotos.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-mono flex items-center shadow-sm">
                <Server size={16} className="mr-2 text-green-400" />
                System: Online
            </div>
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
          color={agentsOnline === totalCompanies && totalCompanies > 0 ? 'green' : 'red'}
        />
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mt-4">Status por Empresa (Agente Remoto)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
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
        {companies.length === 0 && (
          <div className="col-span-3 text-center py-10 text-slate-400">
            Nenhuma empresa encontrada.
          </div>
        )}
      </div>
    </div>
  );
};