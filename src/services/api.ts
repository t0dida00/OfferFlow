import axios, { InternalAxiosRequestConfig } from 'axios';

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

