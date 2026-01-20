const express = require('express')
const router = express.Router();

const { getProjectTasks, 
        createTask,     
        updateTaskStatus, 
        addTaskComment, 
        assignTask, 
        updateTask,
        updateLink } = require('../controllers/taskController');

const protect = require('../middleware/authMiddleware');
const checkProjectRole = require('../middleware/checkProjectRole');

router.get('/project/:projectId', protect, checkProjectRole('user'), getProjectTasks);
router.post('/project/:projectId', protect, checkProjectRole('admin'), createTask);


// OPERACJE NA KONKRETNYM ZADANIU
router.put('/:taskId/status', protect, checkProjectRole('user'), updateTaskStatus);
router.put('/:taskId/assign', protect, checkProjectRole('admin'), assignTask);
router.post('/:taskId/comments', protect, checkProjectRole('user'), addTaskComment);
router.put('/:taskId', protect, checkProjectRole('admin'), updateTask);
router.patch('/:taskId/link', protect, checkProjectRole('user'), updateLink);

module.exports = router;