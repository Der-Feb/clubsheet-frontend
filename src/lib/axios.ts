import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {

    // plug x-club-id from zustand
    

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(timezone)
      config.headers['x-timezone'] = timezone;

    return config;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred'
    
    console.log("Axios Error", errorMessage, error);

    return Promise.reject(new Error(errorMessage))
  }
);