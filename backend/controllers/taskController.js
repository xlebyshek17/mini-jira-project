const Task = require('../models/Task');
const Project = require('../models/Project');

// READ populate podmnieni id przepisane do assignedTo firstName lastName avatarUrl
exports.getProjectTasks = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const tasks = await Task.find({ project: projectId })
            .populate('assignedTo', 'firstName lastName avatarUrl')
            .populate('reporter', 'firstName lastName')
            .populate('comments.author', 'firstName lastName avatarUrl')
            .sort({ order: 1 });

        return res.json(tasks);

    } catch (err) {
        res.status(500).json({ 
            msg: 'Błąd podczas pobieraniu zadań',
            error: err.message
        });
    }
};

// CREATE 
exports.createTask = async (req, res) => {
    try {
        const { title, description, type, priority, assignedTo, dueDate } = req.body;
        const projectId = req.params.projectId;
        const newTask = new Task({
            project: projectId,
            type,
            title,
            description: description || '',
            link: '',
            status: 'To Do',
            priority: priority || 'Medium',
            ...(assignedTo && { assignedTo }), 
            ...(dueDate && { dueDate }),
            reporter: req.user.id,
        });

        const task = await newTask.save();

        return res.status(201).json(task);

    } catch (err) {
        res.status(500).json({ 
            msg: 'Błąd podczas tworzenia zadania',
            error: err.message
        });
    }
};

// UPDATE STATUS 
exports.updateTaskStatus = async (req, res) => {
    try {
        const { newStatus } = req.body;
        const taskId = req.params.taskId;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ msg: 'Zadanie nie istnieje' });
        }

        const userRole = req.projectRole; // rola z middleware
        const isAssigned = task.assignedTo?.toString() === req.user.id;

        if (userRole === 'user') {
            if (!isAssigned) {
                return res.status(403).json({ msg: 'Możesz zmieniać status tylko swoich zadań' });
            }

            if (newStatus === 'Done') {
                return res.status(403).json({ msg: 'Nie masz uprawień do tego ruchu' });
            }
        }

        task.status = newStatus;
        await task.save();

        return res.json(task);

    } catch (err) {
        res.status(500).json({ 
            msg: 'Błąd podczas zmiany statusu',
            error: err.message
        });
    }
};

exports.addTaskComment = async (req, res) => {
    try {
        const { text } = req.body;
        const taskId = req.params.taskId;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ msg: 'Zadanie nie istnieje' });
        }

        task.comments.push({
            text,
            author: req.user.id
        });

        await task.save();

        return res.status(201).json(task.comments);

    } catch (err) {
        return res.status(500).json({ 
            msg: 'Błąd podczas dodawania komentarza',
            error: err.message
        });
    }
};

exports.assignTask = async (req, res) => {
    try {
        const { userId } = req.body;
        const taskId = req.params.taskId;
        const userRole = req.projectRole; // Pobieramy rolę z middleware

        // TYLKO ADMIN może zmieniać wykonawcę zadania
        if (userRole !== 'admin') {
            return res.status(403).json({ msg: 'Tylko admin może przypisywać zadania innym osobom' });
        }

        const task = await Task.findByIdAndUpdate(
            taskId,
            { assignedTo: userId },
            { new: true }
        ).populate('assignedTo', 'firstName lastName avatarUrl');

        if (!task) {
            return res.status(404).json({ msg: 'Zadanie nie istnieje' });
        }

        return res.json(task);
    } catch (err) {
        return res.status(500).json({ 
            msg: 'Błąd podczas przypisywania wykonawcy',
            error: err.message
        });
    }
};

exports.updateLink = async (req, res) => {
    try {
        const { link } = req.body;
        const taskId = req.params.taskId;
        const isAdmin = req.projectRole === 'admin';

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ msg: 'Zadanie nie istnieje' });
        }

        const isAssigned = task.assignedTo?.toString() === req.user.id;

        if (!isAssigned && !isAdmin) {
            return res.status(403).json({ msg: 'Możesz zmieniać link tylko swoich zadań '});
        }

        task.link = link;
        const newTask = await task.save();

        return res.json(newTask);
    } catch (err) {
        return res.status(500).json({ 
            msg: 'Błąd podczas zmiany linka',
            error: err.message
        })
    }
};

//  UPDATE TASK
exports.updateTask = async (req, res) => {
    try {
        const { title, description, priority, type, link, dueDate, assignedTo } = req.body;
        const taskId = req.params.taskId;
        const userRole = req.projectRole;

        if (userRole !== 'admin') {
            return res.status(403).json({ msg: 'Tylko administrator może edytować szczegóły zadania' });
        }

        const assignedToValue = (assignedTo === "" || !assignedTo) ? null : assignedTo;

        const updateFields = {
            title,
            description,
            priority,
            type,
            link: link || '',
            dueDate: dueDate || null,
            assignedTo: assignedToValue
        };

        const task = await Task.findByIdAndUpdate(
            taskId,
            updateFields,
            { new: true, runValidators: true }
        ).populate('assignedTo', 'firstName lastName avatarUrl');

        if (!task) {
            return res.status(404).json({ msg: 'Zadanie nie istnieje' });
        }

        return res.json(task);

    } catch (err) {
        return res.status(500).json({ 
            msg: 'Błąd podczas edycji zadania',
            error: err.message 
        });
    }
};



