import api from '../api/axiosConfig';

const authService = {
    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default authService;
