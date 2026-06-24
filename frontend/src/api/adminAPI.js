import axios from '../instant/axios';

const API_BASE = '/api/admin';

// Get admin token from localStorage
const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

// Create axios instance for admin requests with Bearer token
const createAdminRequest = (config) => {
  const token = getAdminToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};

// Category API calls
export const categoryAPI = {
  create: (formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    return axios.post(`${API_BASE}/categories`, formData, createAdminRequest(config));
  },
  getAll: () => {
    const config = {};
    return axios.get(`${API_BASE}/categories`, createAdminRequest(config));
  },
  getById: (id) => {
    const config = {};
    return axios.get(`${API_BASE}/categories/${id}`, createAdminRequest(config));
  },
  update: (id, formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    return axios.put(`${API_BASE}/categories/${id}`, formData, createAdminRequest(config));
  },
  delete: (id) => {
    const config = {};
    return axios.delete(`${API_BASE}/categories/${id}`, createAdminRequest(config));
  },
  deactivate: (id) => {
    const config = {};
    return axios.patch(`${API_BASE}/categories/${id}/deactivate`, {}, createAdminRequest(config));
  },
};

// Image API calls
export const imageAPI = {
  create: (formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    return axios.post(`${API_BASE}/images`, formData, createAdminRequest(config));
  },
  getAll: () => {
    const config = {};
    return axios.get(`${API_BASE}/images`, createAdminRequest(config));
  },
  getByCategory: (categoryId) => {
    const config = {};
    return axios.get(`${API_BASE}/images/category/${categoryId}`, createAdminRequest(config));
  },
  getById: (id) => {
    const config = {};
    return axios.get(`${API_BASE}/images/${id}`, createAdminRequest(config));
  },
  update: (id, formData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    return axios.put(`${API_BASE}/images/${id}`, formData, createAdminRequest(config));
  },
  delete: (id) => {
    const config = {};
    return axios.delete(`${API_BASE}/images/${id}`, createAdminRequest(config));
  },
  deactivate: (id) => {
    const config = {};
    return axios.patch(`${API_BASE}/images/${id}/deactivate`, {}, createAdminRequest(config));
  },
};
