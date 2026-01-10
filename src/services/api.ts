import axios, { InternalAxiosRequestConfig } from 'axios';
import { User, Application } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchApplications = async (): Promise<any> => {
    const response = await api.get<any>('/gmail/applications');
    return response.data;
};

export const fetchEmails = async (): Promise<any> => {
    const response = await api.get<any>('/gmail/emails');
    return response.data;
};

export const syncGmail = async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/gmail/analyze');
    return response.data;
};

export const fetchCurrentUser = async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    // return response.data;
    // user changed response structure to .data.data in step 186 manually
    return (response.data as any).data;
};

export const updateApplication = async (id: string, data: Partial<Application>): Promise<Application> => {
    const response = await api.put<Application>(`/applications/${id}`, data);
    return response.data;
};

