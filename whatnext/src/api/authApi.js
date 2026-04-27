import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Admin Login
export const adminLogin = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Admin Registration (Optional)
export const adminRegister = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Logout
export const adminLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminEmail');
};

export default { adminLogin, adminRegister, adminLogout };
