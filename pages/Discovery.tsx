import React, { useState, useEffect } from 'react';
import { Radar, Play, CheckCircle, Loader2, Info } from 'lucide-react';

export const Discovery: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleScan = () => {
    setIsScanning(true);
    setProgress(0);
    setLogs(['Iniciando varredura ICMP em 192.168.1.0/24...', 'Iniciando WS-Discovery para dispositivos ONVIF...']);

    // Mock scanning process
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setLogs(prevLogs => [...prevLogs, 'Varredura completa. 4 novos dispositivos encontrados.']);
          return 100;
        }
        
        // Add random logs during scan
        if (prev === 30) setLogs(l => [...l, 'Encontrado 192.168.1.101 (Intelbras VIP 3230 B)']);
        if (prev === 60) setLogs(l => [...l, 'Encontrado 192.168.1.200 (Intelbras MHDX)']);
        if (prev === 85) setLogs(l => [...l, 'Consultando SNMP em 192.168.1.150...']);

        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
          <Radar className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Descoberta de Rede</h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto">
          Escaneie sua rede local para detectar automaticamente dispositivos Intelbras e compatíveis com ONVIF usando ICMP e WS-Discovery.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Sub-rede Alvo (CIDR)</label>
            <input 
              type="text" 
              defaultValue="192.168.1.0/24"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isScanning}
            />
          </div>
          <div className="col-span-1 flex items-end">
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all
                ${isScanning ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
            >
              {isScanning ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} /> Varrendo...
                </>
              ) : (
                <>
                  <Play className="mr-2" size={20} /> Iniciar Varredura
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Logs Console */}
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto border border-slate-800">
          {logs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Info className="mb-2 opacity-50" />
              <span>Pronto para escanear a rede...</span>
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start text-slate-300">
                  <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.includes('Encontrado') ? 'text-green-400' : ''}>{log}</span>
                </div>
              ))}
              {isScanning && <div className="text-blue-400 animate-pulse">_</div>}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
        <Info className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" size={18} />
        <div className="text-sm text-blue-800">
          <strong>Dica:</strong> Garanta que seus dispositivos tenham SNMP v2c/v3 habilitado para telemetria completa. 
          Para câmeras Intelbras, verifique se a autenticação ONVIF está configurada na página "Rede {'>'} ONVIF" do dispositivo.
        </div>
      </div>
    </div>
  );
};