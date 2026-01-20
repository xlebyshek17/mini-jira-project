import api from '../api/axiosConfig';

const projectService = {
    getMyProjects: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    createProject: async (projectData) => {
        const response = await api.post('/projects', projectData);
        return response.data;
    },

    joinProject: async (inviteCode) => {
        const response = await api.post('/projects/join', { inviteCode });
        return response.data;
    },

    getProjectDetails: async (projectId) => {
        const response = await api.get(`/projects/${projectId}`);
        return response.data;
    },

    changeUserRole: async (projectId, userId, newRole) => {
        const response = await api.put(`/projects/${projectId}/role`, { userId, newRole });
        return response.data;
    },

    changeProjectStatus: async (projectId, newStatus) => {
        const response = await api.put(`/projects/${projectId}/status`, { newStatus });
        return response.data;
    },

    removeMember: async (projectId, userId) => {
        const response = await api.delete(`/projects/${projectId}/${userId}`);
        return response.data;
    }
};

export default projectService;