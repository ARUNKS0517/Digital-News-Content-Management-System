import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all news
export const getNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch news');
  }
};

// Get single news by ID
export const getNewsById = async (id) => {
  try {
    const response = await api.get(`/news/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch news');
  }
};

// Create new news
export const createNews = async (newsData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/news`, newsData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create news');
  }
};

// Update news
export const updateNews = async (id, newsData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/news/${id}`, newsData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update news');
  }
};

// Delete news
export const deleteNews = async (id, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/news/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete news');
  }
};

export default api;
