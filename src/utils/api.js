import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "https://bcknd.sea-go.org",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to automatically attach the token and language
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const lang = localStorage.getItem("language") || localStorage.getItem("i18nextLng") || "en";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['lang'] = lang;
    config.headers['Accept-Language'] = lang;
    
    // Add locale to query params
    config.params = { ...config.params, locale: lang };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
