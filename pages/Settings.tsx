import React, { useState } from 'react';
import { MessageSquare, Shield, Smartphone, Zap, Check, WifiOff, QrCode, Server, Terminal, RefreshCw } from 'lucide-react';

export const Settings: React.FC = () => {
  // Estado local para simular o status da conexão para fins de demonstração
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'QR_READY'>('CONNECTED');

  return (
    <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h2>
          <p className="text-slate-500 mt-1">Configure canais de notificação e arquitetura dos agentes.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Server Configuration */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Server className="text-blue-600" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">Configuração do Servidor & Agentes</h3>
                        <p className="text-xs text-slate-500">Arquitetura Distribuída</p>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300">
                        <div className="flex items-center text-green-400 mb-2">
                            <Terminal size={14} className="mr-2" />
                            <span>Comando de Instalação do Agente (Linux/Docker)</span>
                        </div>
                        <p className="break-all select-all cursor-pointer hover:text-white transition-colors">
                            docker run -d --name sentinel-agent -e SERVER_IP=177.153.50.82 -e AGENT_TOKEN=YOUR_TOKEN_HERE sentinel/agent:latest
                        </p>
                    </div>
                    <div className="text-sm text-slate-600">
                        <p className="mb-2"><strong>Arquitetura:</strong> O sistema opera em modo Hub-Spoke.</p>
                        <ul className="list-disc ml-5 space-y-1">
                            <li><strong>Servidor Central:</strong> 177.153.50.82 (Recebe dados e gerencia dashboards)</li>
                            <li><strong>Agentes:</strong> Devem ser instalados na rede local de cada cliente para realizar varreduras (SNMP/ONVIF).</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* WhatsApp / Baileys Configuration */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header with Prominent Status - Dynamic Background */}
                <div className={`p-6 border-b transition-colors duration-500 flex flex-col sm:flex-row justify-between items-center gap-4 ${
                    connectionStatus === 'CONNECTED' ? 'bg-green-50 border-green-200' :
                    connectionStatus === 'DISCONNECTED' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                }`}>
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full mr-4 shadow-sm bg-white`}>
                            <MessageSquare className={`transition-colors duration-500 ${
                                connectionStatus === 'CONNECTED' ? 'text-green-600' :
                                connectionStatus === 'DISCONNECTED' ? 'text-red-600' :
                                'text-yellow-600'
                            }`} size={24} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold ${
                                connectionStatus === 'CONNECTED' ? 'text-green-900' :
                                connectionStatus === 'DISCONNECTED' ? 'text-red-900' :
                                'text-yellow-900'
                            }`}>Integração WhatsApp (Baileys)</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex h-3 w-3 rounded-full ${
                                    connectionStatus === 'CONNECTED' ? 'bg-green-500' :
                                    connectionStatus === 'DISCONNECTED' ? 'bg-red-500' :
                                    'bg-yellow-500 animate-pulse'
                                }`}></span>
                                <p className={`text-sm font-bold uppercase tracking-wide ${
                                    connectionStatus === 'CONNECTED' ? 'text-green-700' :
                                    connectionStatus === 'DISCONNECTED' ? 'text-red-700' :
                                    'text-yellow-700'
                                }`}>
                                    {connectionStatus === 'CONNECTED' && 'CONECTADO'}
                                    {connectionStatus === 'DISCONNECTED' && 'DESCONECTADO'}
                                    {connectionStatus === 'QR_READY' && 'AGUARDANDO LEITURA (QR)'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className={`px-4 py-2 rounded-lg text-sm font-bold border flex items-center shadow-sm bg-white transition-all ${
                            connectionStatus === 'CONNECTED' ? 'text-green-700 border-green-200' :
                            connectionStatus === 'DISCONNECTED' ? 'text-red-700 border-red-200' :
                            'text-yellow-700 border-yellow-200'
                        }`}>
                            {connectionStatus === 'CONNECTED' && <Check size={18} className="mr-2" />}
                            {connectionStatus === 'DISCONNECTED' && <WifiOff size={18} className="mr-2" />}
                            {connectionStatus === 'QR_READY' && <QrCode size={18} className="mr-2" />}
                            
                            {connectionStatus === 'CONNECTED' ? 'SESSÃO ATIVA' : 
                             connectionStatus === 'DISCONNECTED' ? 'SERVIÇO PARADO' : 
                             'LER QR CODE'}
                        </div>
                        
                        {/* Dropdown para simular estados (Demo) */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Simular Estado:</span>
                            <select 
                                value={connectionStatus} 
                                onChange={(e) => setConnectionStatus(e.target.value as any)}
                                className="text-[10px] text-slate-600 border border-slate-300 rounded px-2 py-1 bg-white hover:border-slate-400 focus:outline-none cursor-pointer"
                            >
                                <option value="CONNECTED">Conectado</option>
                                <option value="QR_READY">Aguardando QR</option>
                                <option value="DISCONNECTED">Desconectado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Conditional QR Code Display */}
                {connectionStatus === 'QR_READY' && (
                    <div className="bg-slate-900 p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                        <div className="bg-white p-1 rounded-xl shadow-2xl mb-4 relative group cursor-pointer">
                            <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg group-hover:border-blue-500 transition-colors">
                                <QrCode size={160} className="text-slate-800" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <div className="text-blue-600 font-bold flex flex-col items-center">
                                    <RefreshCw size={32} className="mb-2" />
                                    Atualizar QR
                                </div>
                            </div>
                        </div>
                        <h4 className="text-white font-medium text-lg">Vincular Dispositivo</h4>
                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                            <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">1</span>
                            <span>Abra o WhatsApp</span>
                            <span className="text-slate-600">→</span>
                            <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">2</span>
                            <span>Menu / Configurações</span>
                            <span className="text-slate-600">→</span>
                            <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">3</span>
                            <span>Aparelhos Conectados</span>
                        </div>
                    </div>
                )}
                
                <div className="p-6 space-y-6">
                    <div className="flex items-start bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                        <Shield className="text-yellow-600 mt-0.5 mr-3 flex-shrink-0" size={18} />
                        <div className="text-sm text-yellow-800">
                            <strong>Modo de Conformidade LID (Linked Identity):</strong> Esta instância usa o Baileys RC mais recente. As mensagens serão roteadas prioritariamente via LID para garantir a entrega em grupos de aviso.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Celular do Super Admin</label>
                            <input type="text" defaultValue="+55 11 99999-9999" className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Nome da Sessão</label>
                            <input type="text" defaultValue="sentinel_server_core" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 font-medium text-sm transition-colors shadow-sm">
                        Salvar Configuração
                    </button>
                </div>
            </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-yellow-500" /> Saúde do Server
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">IP Público</span>
                        <span className="text-slate-800 font-mono">177.153.50.82</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">PostgreSQL Central</span>
                        <span className="text-green-600 flex items-center"><Check size={14} className="mr-1"/> Conectado</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Receptor de Agentes</span>
                        <span className="text-green-600 flex items-center"><Check size={14} className="mr-1"/> Porta 443</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center text-sm">
                        <span className="text-slate-600">WhatsApp Baileys</span>
                        <span className={`flex items-center font-medium ${
                            connectionStatus === 'CONNECTED' ? 'text-green-600' :
                            connectionStatus === 'DISCONNECTED' ? 'text-red-600' :
                            'text-yellow-600'
                        }`}>
                            {connectionStatus === 'CONNECTED' && <Check size={14} className="mr-1"/>}
                            {connectionStatus === 'DISCONNECTED' && <WifiOff size={14} className="mr-1"/>}
                            {connectionStatus === 'QR_READY' && <QrCode size={14} className="mr-1"/>}
                            {connectionStatus === 'CONNECTED' ? 'Ativo' : 
                             connectionStatus === 'DISCONNECTED' ? 'Inativo' : 'Aguardando'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};