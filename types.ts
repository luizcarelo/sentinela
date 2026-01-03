export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  WARNING = 'WARNING',
  MAINTENANCE = 'MAINTENANCE',
}

export enum DeviceType {
  NVR = 'NVR',
  CAMERA = 'CAMERA',
  ALARM = 'ALARM',
  SWITCH = 'SWITCH',
}

export enum Vendor {
  INTELBRAS = 'Intelbras',
  HIKVISION = 'Hikvision',
  DAHUA = 'Dahua',
  AXIS = 'Axis',
  GENERIC = 'Generic ONVIF',
}

export interface Company {
  id: string;
  name: string;
  document: string; // CNPJ/CPF
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  agentStatus: 'CONNECTED' | 'DISCONNECTED';
  agentIp: string;
  totalDevices: number;
  contact: string;
}

export interface Device {
  id: string;
  companyId: string; // Vínculo com a empresa
  name: string;
  ip: string;
  port: number;
  type: DeviceType;
  vendor: Vendor;
  model: string;
  location: string;
  status: DeviceStatus;
  uptime: string; 
  lastSeen: string;
  firmware: string;
  mac: string;
  tags: string[];
}

export interface Alert {
  id: string;
  companyId: string; // Vínculo com a empresa
  deviceId: string;
  deviceName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface DiscoveryResult {
  ip: string;
  mac: string;
  vendor: string;
  onvifSupport: boolean;
}

export interface WhatsAppConfig {
  status: 'CONNECTED' | 'DISCONNECTED' | 'QR_READY';
  lidEnabled: boolean;
  phoneNumber: string;
  baileysVersion: string;
}
