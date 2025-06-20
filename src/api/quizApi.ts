import api from './axiosInstance';

export const fetchQuizzes = async (category?: string, difficulty?: string) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (difficulty) params.append('difficulty', difficulty);
  
  const response = await api.get(`/quizzes?${params.toString()}`);
  return response.data;
};

export const getQuizById = async (id: string) => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

export const submitQuiz = async (quizId: string, answers: any[]) => {
  const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
  return response.data;
};
