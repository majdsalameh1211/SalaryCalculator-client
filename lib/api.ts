import axios from 'axios';
import Cookies from 'js-cookie';
import { Shift, MonthlyShiftsResponse, Settings, StatsResponse } from '@/types';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = Cookies.get('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove('auth_token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(err);
  }
);

export const login = async (password: string): Promise<void> => {
  const { data } = await axios.post(`${BASE}/api/auth/login`, { password });
  Cookies.set('auth_token', data.token, { expires: 30, sameSite: 'strict' });
};

export const logout = (): void => {
  Cookies.remove('auth_token');
  window.location.replace('/login');
};

export const getShifts = async (month: number, year: number): Promise<MonthlyShiftsResponse> => {
  const { data } = await api.get('/api/shifts', { params: { month, year } });
  return data;
};

export const getStats = async (mode: 'all' | 'month', month?: number, year?: number): Promise<StatsResponse> => {
  const { data } = await api.get('/api/shifts/stats', { params: { mode, month, year } });
  return data;
};

export const createShift = async (payload: object): Promise<Shift> => {
  const { data } = await api.post('/api/shifts', payload);
  return data;
};

export const updateShift = async (id: string, payload: object): Promise<Shift> => {
  const { data } = await api.put(`/api/shifts/${id}`, payload);
  return data;
};

export const deleteShift = async (id: string): Promise<void> => {
  await api.delete(`/api/shifts/${id}`);
};

export const getSettings = async (): Promise<Settings> => {
  const { data } = await api.get('/api/settings');
  return data;
};

export const updateSettings = async (payload: Partial<Settings>): Promise<Settings> => {
  const { data } = await api.put('/api/settings', payload);
  return data;
};
