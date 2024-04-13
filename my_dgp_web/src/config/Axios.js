import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.9:4000'
});

axiosInstance.interceptors.request.use(async function (config) {
  let token = localStorage.getItem('token');
  token = token ? JSON.parse(token) : '';

  config.headers.Authorization = `${token}`;
  return config;
});

export default axiosInstance;

// local- http://192.168.1.8:4000
// stag - https://my-dgp.onrender.com/
// prod - http://216.107.139.167:4001/