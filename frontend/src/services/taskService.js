import api from '../api/axiosConfig';

const taskService = {
    getProjectTasks: async (projectId) => {
        const response = await api.get(`/tasks/project/${projectId}`);
        return response.data; 
    },

    createTask: async (projectId, taskData) => {
        // taskData: { title, description, type, priority, assignedTo, dueDate }
        const response = await api.post(`/tasks/project/${projectId}`, taskData);
        return response.data;
    },

    updateStatus: async (taskId, newStatus, commentText = '') => {
        const response = await api.put(`/tasks/${taskId}/status`, { newStatus, commentText });
        return response.data;
    },

    addComment: async (taskId, text) => {
        const response = await api.post(`/tasks/${taskId}/comments`, { text });
        return response.data;
    },

    assignTask: async (taskId, userId) => {
        const response = await api.put(`/tasks/${taskId}/assign`, { userId });
        return response.data;
    },

    updateTask: async (taskId, updatedTask) => {
        const response = await api.put(`/tasks/${taskId}`, updatedTask);
        return response.data;
    }
};

export default taskService;