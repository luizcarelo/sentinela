import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, RefreshCw, ArrowLeft, Network, Loader2 } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Device, Company } from '../types';
import { api } from '../services/api';

interface InventoryProps {
    companyId?: string;
    onBack?: () => void;
}

export const Inventory: React.FC<InventoryProps> = ({ companyId, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper para buscar status do agente
  const getAgentStatus = (deviceCompanyId: string) => {
    const company = companies.find(c => c.id === deviceCompanyId);
    return company?.agentStatus || 'DISCONNECTED';
  };

  const getCompanyName = (deviceCompanyId: string) => {
      const company = companies.find(c => c.id === deviceCompanyId);
      return company?.name || 'Unknown';
  };

  const loadData = async () => {
      setLoading(true);
      try {
          // Fetch devices
          const fetchedDevices = await api.getDevices(companyId);
          setDevices(fetchedDevices);

          // Fetch companies context for Agent Status map
          // (Se tiver companyId, fetch só dela, senão todas)
          const fetchedCompanies = await api.getCompanies();
          setCompanies(fetchedCompanies);

      } catch (err) {
          console.error("Failed to load inventory", err);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    loadData();
  }, [companyId]);

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.ip.includes(searchTerm) ||
    d.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayCompanyName = companyId 
    ? companies.find(c => c.id === companyId)?.name 
    : 'Todos os Clientes';

  if (loading) return (
      <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
               <ArrowLeft size={20} className="text-slate-600" />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Inventário: {displayCompanyName}</h2>
            <p className="text-slate-500 mt-1">Gerencie e monitore os ativos locados.</p>
          </div>
        </div>
        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors">
          <Plus size={18} className="mr-2" />
          Adicionar Dispositivo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, IP ou modelo..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">
              <Filter size={18} className="mr-2" />
              Filtrar
            </button>
            <button 
                onClick={loadData}
                className="flex-1 sm:flex-none items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={18} className="mr-2" />
              Sincronizar
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Nome do Dispositivo</th>
                <th className="px-6 py-4 font-semibold">Endereço IP</th>
                <th className="px-6 py-4 font-semibold">Tipo & Fabricante</th>
                {!companyId && <th className="px-6 py-4 font-semibold">Cliente</th>}
                <th className="px-6 py-4 font-semibold">Localização</th>
                <th className="px-6 py-4 font-semibold">Status Agente</th>
                <th className="px-6 py-4 font-semibold">Status Disp.</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDevices.map((device) => {
                const agentStatus = getAgentStatus(device.companyId);
                return (
                  <tr key={device.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{device.name}</div>
                      <div className="text-xs text-slate-400">{device.model} • FW: {device.firmware}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                      <a href={`http://${device.ip}:${device.port}`} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:underline">
                          {device.ip}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700">{device.vendor}</div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 border border-slate-200 mt-1">
                        {device.type}
                      </span>
                    </td>
                    {!companyId && (
                        <td className="px-6 py-4 text-sm text-slate-600">
                            {getCompanyName(device.companyId)}
                        </td>
                    )}
                    <td className="px-6 py-4 text-slate-600">{device.location}</td>
                    <td className="px-6 py-4">
                        {agentStatus === 'CONNECTED' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200" title="Agente Remoto Online">
                                <Network size={12} className="mr-1.5" />
                                Online
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200" title="Agente Remoto Offline">
                                <Network size={12} className="mr-1.5" />
                                Offline
                            </span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={device.status} />
                      <div className="text-xs text-slate-400 mt-1">Up: {device.uptime}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredDevices.length === 0 && (
                <tr>
                    <td colSpan={companyId ? 7 : 8} className="px-6 py-12 text-center text-slate-400">
                        Nenhum dispositivo encontrado.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};