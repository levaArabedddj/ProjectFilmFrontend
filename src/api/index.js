import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/',  // Убедитесь, что это правильный адрес вашего бэкенда
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;  // Если есть токен, добавляем его в заголовки
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
