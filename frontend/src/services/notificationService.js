import api from '../api/axiosConfig';

const notificationService = {
    getNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    markAsRead: async (notificationId) => {
        const response = await api.patch(`/notifications/${notificationId}`);
        return response.data;
    }
};

export default notificationService;