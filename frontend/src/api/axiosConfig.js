import axios from 'axios';

// Tworzymy instancję axiosa z adresem Twojego backendu
const api = axios.create({
    baseURL: 'api', // Twój adres backendu
    headers: {
        'Content-Type': 'application/json',
    },
});

// To jest INTERCEPTOR (Przechwytywacz)
// Przed każdym wysłaniem zapytania, sprawdź, czy mamy token w szufladzie (localStorage)
// Jeśli tak -> doklej go do nagłówka "Authorization"
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;