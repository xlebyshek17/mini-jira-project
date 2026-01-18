const Project = require('../models/Project');

const checkProjectRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const projectId = req.params.projectId || req.body.projectId;
            const userId = req.user.id;

            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ msg: 'Projekt nie istnieje'} );
            }
                
            const member = project.members.find(m => m.user.toString() === userId);
            if (!member) {
                return res.status(403).json({ msg: 'Odmowa dostępu: Nie jesteś członkiem tego projektu!' });
            }

            if (requiredRole === 'admin' && member.role !== 'admin') {
                return res.status(403).json({ msg: 'Wymagane uprawnienia administratora projektu'})
            }

            return req.projectRole = member.role;
            next();
        } catch (err) {
            return res.status(500).json({ msg: 'Server Error' });
        }
    };
};

module.exports = checkProjectRole;