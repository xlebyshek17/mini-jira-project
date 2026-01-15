const express = require('express')
const router = express.Router();

const {
    createProject,
    joinProject,
    getMyProjects,
    getProjectDetails,
    changeUserRole,
    changeProjectStatus
} = require('../controllers/projectController');

const protect = reqiure('../middleware/authMiddleware');
const checkProjectRole = require('../middleware/checkProjectRole');

router.post('/', protect, createProject);
router.post('/join', protect, joinProject);
router.get('/', protect, getMyProjects);
router.get('/:projectId', protect, checkProjectRole('user'), getProjectDetails);
router.patch('/:projectId/role', protect, checkProjectRole('admin'), changeUserRole);
router.patch('/:projectId/status', protect, checkProjectRole('admin'), changeProjectStatus);

module.exports = router;