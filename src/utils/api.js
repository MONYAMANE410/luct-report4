import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/';
};

export default API;
