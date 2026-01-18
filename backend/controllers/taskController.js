const Task = require('../models/Task');
const Project = require('../models/Project');

// READ populate podmnieni id przepisane do assignedTo firstName lastName avatarUrl
exports.getProjectTasks = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const tasks = await Task.find({ project: projectId })
            .populate('assignedTo', 'firstName lastName avatarUrl')
            .populate('reporter', 'firstName lastName')
            .sort({ order: 1 });

        return res.json(tasks);

    } catch (err) {
        res.status(500).json({ msg: 'Błąd podczas pobieraniu zadań'} );
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
            description,
            status: 'To Do',
            priority,
            dueDate,
            assignedTo,
            reporter: req.user.id,
        });

        const task = await newTask.save();

        return res.status(201).json(task);

    } catch (err) {
        res.status(500).json({ msg: 'Błąd podczas tworzenia zadania' });
    }
};

// UPDATE STATUS 
exports.updateTaskStatus = async (req, res) => {
    try {
        const { newStatus, commentText } = req.body;
        const taskId = req.params.taskId;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ msg: 'Zadanie nie istnieje' });
        }

        const userRole = req.projectRole; // rola z middleware
        const isAssigned = task.assignedTo.toString() === req.user.id;

        if (userRole === 'user') {
            if (!isAssigned) {
                return res.status(403).json({ msg: 'Możesz zmieniać status tylko swoich zadań' });
            }

            if (newStatus === 'Done') {
                return res.status(403).json({ msg: 'Nie masz uprawień do tego ruchu' });
            }
        }

        if (userRole === 'admin' && task.status === 'In Review' && newStatus === 'To Do') {
            if (!commentText) {
                return res.status(400).json({ msg: 'Wymagany komentarz przy odrzuceniu zadania' });
            }

            task.comments.push({
                text: commentText,
                author: req.user.id
            });
        }

        task.status = newStatus;
        await task.save();

        return res.json(task);

    } catch (err) {
        res.status(500).json({ msg: 'Błąd podczas zmiany statusu' });
    }
};

exports.addTaskComment = async (req, res) => {
    try {
        const { text } = req.body;
        const taskId = req.params.taskId;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.json(404).json({ msg: 'Zadanie nie istnieje' });
        }

        task.comments.push({
            text,
            author: req.user.id
        });

        await task.save();

        return res.status(201).json(task.comments);

    } catch (err) {
        return res.status(500).json({ msg: 'Błąd podczas dodawania komentarza' });
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
        return res.status(500).json({ msg: 'Błąd podczas przypisywania wykonawcy' });
    }
};

//  UPDATE TASK
exports.updateTask = async (req, res) => {
    try {
        const { title, descriptione, priority, dueDate } = req.body;
        const taskId = req.params.taskId;
        const userRole = req.projectRole;

        if (userRole !== 'admin') {
            return res.status(403).json({ msg: 'Tylko administrator może edytować szczegóły zadania' });
        }

        const task = await Task.findByIdAndUpdate(
            taskId,
            { 
                title, 
                description, 
                priority, 
                type, 
                dueDate 
            },
            { new: true, runValidators: true } // runValidators sprawdzi czy dane są zgodne z enumami w Schema
        ).populate('assignedTo', 'firstName lastName avatarUrl');

        if (!task) {
            return res.status(404).json({ msg: 'Zadanie nie istnieje' });
        }
    } catch (err) {
        return res.status(500).json({ msg: 'Błąd podczas edycji zadania' });
    }
};



