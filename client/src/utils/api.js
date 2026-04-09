import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

export const convertFile = async (file, targetFormat, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetFormat', targetFormat);

  const response = await api.post('/api/convert', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(pct);
      }
    },
  });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/api/history');
  return response.data;
};

export const deleteHistory = async (id) => {
  const response = await api.delete(`/api/history/${id}`);
  return response.data;
};

export const getSupportedFormats = async () => {
  const response = await api.get('/api/convert/supported');
  return response.data;
};

export const getDownloadUrl = (path) =>
  path.startsWith('http') ? path : `${BASE_URL}${path}`;

export default api;
