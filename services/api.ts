import { Company, Device, Alert } from '../types';
import { MOCK_COMPANIES, MOCK_DEVICES, MOCK_ALERTS } from '../constants';

// Use relative path to leverage Vite's proxy. 
// If the backend is not available, the code falls back to Mock data.
const API_URL = '/api';

/**
 * Helper to fetch from API with automatic fallback to Mock data on error.
 * This prevents the UI from crashing if the backend is offline.
 */
async function fetchWithFallback<T>(endpoint: string, mockData: T): Promise<T> {
    try {
        // Attempt to fetch from the backend
        const res = await fetch(`${API_URL}${endpoint}`);
        
        // If 404 (route not found in proxy or backend) or 500, throw to trigger fallback
        if (!res.ok) {
            throw new Error(`API Status: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.warn(`[Sentinel Mode] Backend unreachable (${endpoint}). Serving cached/mock data.`);
        // Return mock data immediately (or with slight delay to simulate network)
        return Promise.resolve(mockData);
    }
}

export const api = {
  async getCompanies(): Promise<Company[]> {
    return fetchWithFallback('/companies', MOCK_COMPANIES);
  },

  async getDevices(companyId?: string): Promise<Device[]> {
    const query = companyId ? `?companyId=${companyId}` : '';
    // Filter mocks to simulate backend behavior
    const mockData = companyId 
        ? MOCK_DEVICES.filter(d => d.companyId === companyId) 
        : MOCK_DEVICES;
        
    return fetchWithFallback(`/devices${query}`, mockData);
  },

  async getAlerts(companyId?: string): Promise<Alert[]> {
    const query = companyId ? `?companyId=${companyId}` : '';
    const mockData = companyId 
        ? MOCK_ALERTS.filter(a => a.companyId === companyId) 
        : MOCK_ALERTS;
        
    return fetchWithFallback(`/alerts${query}`, mockData);
  },

  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      const res = await fetch(`${API_URL}/alerts/${alertId}/ack`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
    } catch (error) {
      console.warn('API Ack failed (Backend offline). Optimistic update only.');
    }
  }
};