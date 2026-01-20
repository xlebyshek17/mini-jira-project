const Project = require('../models/Project');
const crypto = require('crypto');
const Task = require('../models/Task');

// CREATE PROJECT
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        const newProject = new Project({
            name,
            description,
            owner: req.user.id,
            inviteCode,
            members: [{user: req.user.id, role: 'admin' }]
        })

        const project = await newProject.save();
        return res.status(201).json(project);
    } catch (err) {
        return res.status(500).json({ 
            msg: 'Bład podczas tworzenia projektu',
            error: err.message
         });
    }
};

// JOIN PROJECT
exports.joinProject = async (req, res) => {
    try {
        const { inviteCode } = req.body;

        const project = await Project.findOne({ inviteCode });
        if (!project) {
            return res.status(404).json({ msg: 'Nie znalieziono projektu o tym kodzie'} );
        }

        const isMember = project.members.some(m => m.user.toString() === req.user.id);
        if (isMember) {
            return res.status(400).json({ msg: 'Już jesteś członkiem tego projektu'} );
        }

        project.members.push({ user: req.user.id, role: 'user'} );
        await project.save();

        return res.json({ 
            msg: 'Dołączono do projektu!', 
            project} );
    } catch (err) {
        return res.status(500).json({ 
            msg: 'Błąd podczas dołączenia',
            error: err.message
        });
    }
};

// GET PROJECTS
exports.getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ "members.user": req.user.id });
        return res.json(projects);
    } catch (err) {
        return res.status(500).json({ 
            msg: 'Błąd serwera',
            error: err.message
        });
    }
};

// GET PROJECT DETAILS
exports.getProjectDetails = async (req, res) => {
    try {
        const projectId = req.params.projectId || req.body.projectId;

        const project = await Project.findById(projectId)
            .populate('owner', 'firstName lastName email avatarUrl')
            .populate('members.user', 'firstName lastName email avatarUrl');
        if (!project) {
            return res.status(404).json({ msg: 'Projekt nie istnieje' });
        }

        return res.json(project);
    } catch (err) {
        return res.status(500).json({ 
            msg: 'Błąd podczas pobierania danych projektu',
            error: err.message
        });
    }
};

// CHANGE USER ROLE
exports.changeUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;

        const project = await Project.findById(req.params.projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Projekt nie istnieje' });
        }

        // findIndex służy do znalezienia pozycji (numeru miejsca) objekta w tablicy
        const memberIndex = project.members.findIndex(m => m.user.toString() === userId);
        if (memberIndex === -1) {
            return res.status(404).json({ msg: 'Użytkownik nie jest członkiem tego projektu'} );
        }

        project.members[memberIndex].role = newRole;
        await project.save();

        return res.json({ 
            msg: `Rola zmieniona na ${newRole}`, 
            project });
    } catch (err) {
        return res.status(500).json({ 
            msg: 'Błąd podczas zmieny roli',
            error: err.message
        });
    }
};

// CHANGE PROJECT STATUS 
exports.changeProjectStatus = async (req, res) => {
    try {
        const { newStatus }  = req.body;
        const projectId = req.params.projectId || req.body.projectId;
        
        const allowedStatuses = ['active', 'archived'];
        if (!allowedStatuses.includes(newStatus)) {
            return res.status(400).json({ msg: 'Nieprawidłowy status projektu' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Projekt nie istnieje' });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Tylko właściciel projektu może zmienić jego status' });
        }

        project.status = newStatus;
        await project.save();

        return res.json({ 
            msg: `Status zmieniony na ${newStatus}`, 
            project} );
    } catch (err) {
        return res.status(500).json({ 
            msg: 'Błąd podczas zmieny statusa projektu',
            error: err.message
        });
    }
};

exports.removeMember = async (req, res) => {
    try {
        const { projectId, userId } = req.params;

        const project = await Project.findByIdAndUpdate(
            projectId,
            { $pull: { members: { user: userId } } },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({ msg: 'Projekt nie instenieje' });
        }

        await Task.updateMany(
            { project: projectId, assignedTo: userId },
            { $set: { assignedTo: null } }
        );

        return res.json({ msg: 'Użytkownik usunięty, a zadania zostały odpięte'})

    } catch (err) {

    }
};