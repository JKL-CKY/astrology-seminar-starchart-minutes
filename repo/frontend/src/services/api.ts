import axios from 'axios';
import { Seminar, Planet, Aspect, House } from '../../shared/types';

const api = axios.create({
  baseURL: '/api'
});

export const seminarApi = {
  create: (formData: FormData) => api.post<{ seminarId: string; status: string }>('/seminars', formData),
  get: (id: string) => api.get<Seminar>(`/seminars/${id}`),
  list: () => api.get<Seminar[]>('/seminars'),
  sendEmail: (id: string, to: string) => 
    api.post<{ message: string; emailPreview: string }>(`/seminars/${id}/send-email`, { to }),
  generateDemo: () => api.get<Seminar>('/seminars/demo'),
  getChartData: (date?: string) => 
    api.get<{ planets: Planet[]; aspects: Aspect[]; houses: House[] }>('/seminars/chart/data', 
      date ? { params: { date } } : undefined)
};
