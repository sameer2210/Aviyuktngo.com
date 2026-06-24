import axios from '../instant/axios';

const ADMIN_API_BASE = '/api/admin/auth';

export const adminAuthAPI = {
  login: (username, password) =>
    axios.post(`${ADMIN_API_BASE}/login`, { username, password }),
  logout: () => axios.post(`${ADMIN_API_BASE}/logout`),
};
