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
        window.location.href = '/';
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        if (response.data.user) {
            const oldUser = JSON.parse(localStorage.getItem('user'));
            const mergedUser = { ...oldUser, ...response.data.user };
            
            localStorage.setItem('user', JSON.stringify(mergedUser));
            return { user: mergedUser };
        }
        return response.data;
    },

    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await api.post('/auth/upload-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }
        });

        const user = JSON.parse(localStorage.getItem('user'));
        user.avatarUrl = response.data.avatarUrl;
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
    }
};

export default authService;
