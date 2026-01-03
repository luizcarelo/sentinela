import { Company, Device, Alert } from '../types';

// Direct connection to the backend server to avoid proxy resolution issues
const API_URL = 'http://localhost:3000/api';

export const api = {
  async getCompanies(): Promise<Company[]> {
    try {
      const res = await fetch(`${API_URL}/companies`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${res.statusText || errorText}`);
      }
      return res.json();
    } catch (error) {
      console.error('API Error (getCompanies):', error);
      throw error;
    }
  },

  async getDevices(companyId?: string): Promise<Device[]> {
    try {
      const query = companyId ? `?companyId=${companyId}` : '';
      const res = await fetch(`${API_URL}/devices${query}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${res.statusText || errorText}`);
      }
      return res.json();
    } catch (error) {
       console.error('API Error (getDevices):', error);
       throw error;
    }
  },

  async getAlerts(companyId?: string): Promise<Alert[]> {
    try {
      const query = companyId ? `?companyId=${companyId}` : '';
      const res = await fetch(`${API_URL}/alerts${query}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${res.statusText || errorText}`);
      }
      return res.json();
    } catch (error) {
      console.error('API Error (getAlerts):', error);
      throw error;
    }
  },

  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      const res = await fetch(`${API_URL}/alerts/${alertId}/ack`, {
        method: 'POST',
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${res.statusText || errorText}`);
      }
    } catch (error) {
      console.error('API Error (acknowledgeAlert):', error);
      throw error;
    }
  }
};