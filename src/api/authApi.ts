import api from './axiosInstance';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};
