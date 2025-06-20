import api from './axiosInstance';

export const getUserProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateUserProfile = async (userData: {
  name?: string;
  avatar?: string;
  preferences?: any;
}) => {
  const response = await api.patch('/users/me', userData);
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get('/users/me/stats');
  return response.data;
};
