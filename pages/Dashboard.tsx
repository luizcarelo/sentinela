import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, Server, AlertTriangle, ShieldCheck, Wifi, ArrowLeft, ChevronDown, ChevronUp, MapPin, Cpu, Info, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { BITRATE_DATA, NETWORK_TRAFFIC_DATA } from '../constants';
import { DeviceStatus, Company, Alert, Device } from '../types';
import { api } from '../services/api';

interface DashboardProps {
    companyId?: string;
    onBack?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ companyId, onBack }) => {
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // State for Real Data
  const [company, setCompany] = useState<Company | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        if (!companyId) return;
        setLoading(true);
        try {
            // Fetch company info (usando lista de todas as empresas e filtrando, 
            // idealmente teria um endpoint /companies/:id)
            const allCompanies = await api.getCompanies();
            const foundCompany = allCompanies.find(c => c.id === companyId);
            setCompany(foundCompany || null);

            const [alertsData, devicesData] = await Promise.all([
                api.getAlerts(companyId),
                api.getDevices(companyId)
            ]);
            setAlerts(alertsData);
            setDevices(devicesData);
        } catch (e) {
            console.error("Error loading dashboard data", e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [companyId]);
  
  const onlineCount = devices.filter(d => d.status === DeviceStatus.ONLINE).length;
  const onlineRatio = devices.length > 0 ? ((onlineCount / devices.length) * 100).toFixed(1) : '0';

  const toggleAlert = (id: string) => {
    if (expandedAlertId === id) {
      setExpandedAlertId(null);
    } else {
      setExpandedAlertId(id);
    }
  };

  const handleAcknowledge = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
        await api.acknowledgeAlert(id);
        // Atualiza estado local
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    } catch (err) {
        alert("Erro ao reconhecer alerta. Tente novamente.");
    }
  };

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
        setIsGeneratingReport(false);
        alert(`Relatório PDF gerado com sucesso para: ${company?.name}`);
    }, 2000);
  };

  const getDeviceDetails = (deviceId: string) => {
    return devices.find(d => d.id === deviceId);
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;
  if (!company) return <div>Empresa não encontrada ou erro de conexão.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
            {onBack && (
                <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors" title="Voltar para Central">
                    <ArrowLeft size={20} className="text-slate-600" />
                </button>
            )}
            <div>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-800">Painel do Cliente</h2>
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-sm border border-slate-200">
                        {company.name}
                    </span>
                </div>
                <p className="text-slate-500 text-sm mt-1">Monitoramento via Agente Remoto ({company.agentIp})</p>
            </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
            <button 
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border shadow-sm transition-all
                ${isGeneratingReport 
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-wait' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300'}`}
            >
                {isGeneratingReport ? (
                    <>
                        <Loader2 size={16} className="mr-2 animate-spin" /> Gerando PDF...
                    </>
                ) : (
                    <>
                        <FileText size={16} className="mr-2" /> Exportar Relatório
                    </>
                )}
            </button>
            <span className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center border ${
                company.status === 'HEALTHY' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
            }`}>
                <ShieldCheck className="w-4 h-4 mr-2" /> {company.status === 'HEALTHY' ? 'Status: Estável' : 'Status: Atenção'}
            </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Dispositivos Locados" 
          value={devices.length} 
          icon={<Server size={24} />} 
          trend="0%" 
          trendUp={true} 
          color="blue"
        />
        <StatCard 
          title="Alertas Ativos" 
          value={alerts.length} 
          icon={<AlertTriangle size={24} />} 
          trend={alerts.length > 0 ? "+1" : "0"} 
          trendUp={false} 
          color="red"
        />
        <StatCard 
          title="Uptime do Link" 
          value="99.9%" 
          icon={<Activity size={24} />} 
          trend="0.1%" 
          trendUp={true} 
          color="purple"
        />
        <StatCard 
          title="Taxa de Online" 
          value={`${onlineRatio}%`} 
          icon={<Wifi size={24} />} 
          trend="0.5%" 
          trendUp={true} 
          color={Number(onlineRatio) > 90 ? "green" : "orange"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Tráfego de Rede (Entrada no Agente)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={NETWORK_TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" name="Tráfego" stroke="#6366f1" fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Bitrate Médio RTSP (Câmeras)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={BITRATE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="value" name="Bitrate" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Alerts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Eventos Críticos (Filtrado: {company.name})</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver Todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-medium w-8"></th>
                <th className="px-6 py-3 font-medium">Severidade</th>
                <th className="px-6 py-3 font-medium">Dispositivo</th>
                <th className="px-6 py-3 font-medium">Mensagem</th>
                <th className="px-6 py-3 font-medium">Hora</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.length === 0 ? (
                 <tr><td colSpan={6} className="px-6 py-4 text-center text-slate-500">Nenhum alerta recente para esta empresa.</td></tr>
              ) : (
                alerts.map((alert) => {
                    const device = getDeviceDetails(alert.deviceId);
                    const isExpanded = expandedAlertId === alert.id;
                    
                    return (
                    <React.Fragment key={alert.id}>
                        <tr 
                            onClick={() => toggleAlert(alert.id)}
                            className={`cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                        >
                            <td className="px-6 py-4 text-slate-400">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold
                                ${alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 
                                    alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' : 
                                    'bg-blue-100 text-blue-800'}`}>
                                {alert.severity}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-700">{alert.deviceName}</td>
                            <td className="px-6 py-4 text-slate-600">{alert.message}</td>
                            <td className="px-6 py-4 text-slate-500 text-sm">{alert.timestamp}</td>
                            <td className="px-6 py-4">
                                {alert.acknowledged ? (
                                    <span className="text-green-600 text-sm flex items-center"><ShieldCheck size={14} className="mr-1"/> Ack</span>
                                ) : (
                                    <span className="text-orange-500 text-sm font-medium">Pendente</span>
                                )}
                            </td>
                        </tr>
                        {/* Expanded Detail Row */}
                        {isExpanded && (
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <td colSpan={6} className="px-6 py-4">
                                    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-200">
                                        
                                        {/* Detalhes do Dispositivo */}
                                        <div className="flex-1 space-y-3">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                                <Info size={14} className="mr-2" /> Detalhes do Dispositivo
                                            </h4>
                                            {device ? (
                                                <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                    <div>
                                                        <span className="text-slate-500 block text-xs">Modelo</span>
                                                        <span className="font-medium text-slate-800">{device.model}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 block text-xs">Fabricante</span>
                                                        <span className="font-medium text-slate-800">{device.vendor}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 block text-xs">IP / Porta</span>
                                                        <span className="font-mono text-slate-700">{device.ip}:{device.port}</span>
                                                    </div>
                                                     <div>
                                                        <span className="text-slate-500 block text-xs">Firmware</span>
                                                        <span className="text-slate-700">{device.firmware}</span>
                                                    </div>
                                                    <div className="col-span-2 border-t border-slate-100 pt-2 mt-1">
                                                        <span className="text-slate-500 block text-xs mb-1">Localização</span>
                                                        <span className="flex items-center text-slate-700 font-medium">
                                                            <MapPin size={14} className="mr-1 text-slate-400" /> {device.location}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-slate-500 italic text-sm">Informações do dispositivo não disponíveis.</div>
                                            )}
                                        </div>

                                        {/* Ações e Diagnóstico */}
                                        <div className="flex-1 space-y-3">
                                             <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                                                <Cpu size={14} className="mr-2" /> Diagnóstico & Ação
                                            </h4>
                                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
                                                <p className="text-sm text-slate-600">
                                                    Este alerta foi gerado automaticamente pelo motor de regras. Verifique a conectividade do dispositivo e os logs de stream RTSP.
                                                </p>
                                                
                                                <div className="flex items-center justify-end gap-3 pt-2">
                                                    {!alert.acknowledged ? (
                                                        <button 
                                                            onClick={(e) => handleAcknowledge(e, alert.id)}
                                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                                        >
                                                            <CheckCircle size={16} className="mr-2" />
                                                            Reconhecer Alerta
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center text-green-700 bg-green-50 px-4 py-2 rounded-lg text-sm border border-green-100 w-full justify-center">
                                                            <ShieldCheck size={16} className="mr-2" />
                                                            Alerta Reconhecido e Arquivado
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};