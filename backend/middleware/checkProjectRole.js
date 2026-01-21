const Project = require('../models/Project');
const Task = require('../models/Task');

const checkProjectRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const paramsProjectId = req.params?.projectId;
            const bodyProjectId = req.body?.projectId;
            const taskId = req.params?.taskId;

            let projectId;

            // Jeśli nie mamy bezpośrednio ID projektu, ale mamy ID zadania
            if (!paramsProjectId && !bodyProjectId && taskId) {
                const task = await Task.findById(taskId);
                if (!task) return res.status(404).json({ msg: 'Zadanie nie istnieje' });
                projectId = task.project;
            } else {
                projectId = paramsProjectId || bodyProjectId;
            }
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

            req.projectRole = member.role;
            next();
        } catch (err) {
            console.log(err);
            return res.status(500).json({ 
                msg: 'Server Error',
                err: err.msg 
            });
        }
    };
};

module.exports = checkProjectRole;