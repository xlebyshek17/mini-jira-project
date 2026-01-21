const express = require('express')
const router = express.Router();

const {
    createProject,
    joinProject,
    getMyProjects,
    getProjectDetails,
    changeUserRole,
    changeProjectStatus,
    removeMember,
    archiveProject,
    updateProject
} = require('../controllers/projectController');

const protect = require('../middleware/authMiddleware');
const checkProjectRole = require('../middleware/checkProjectRole');

router.post('/', protect, createProject);
router.post('/join', protect, joinProject);
router.get('/', protect, getMyProjects);
router.get('/:projectId', protect, checkProjectRole('user'), getProjectDetails);
router.patch('/:projectId/role', protect, checkProjectRole('admin'), changeUserRole);
router.patch('/:projectId/status', protect, checkProjectRole('admin'), changeProjectStatus);
router.delete('/:projectId/:userId', protect, checkProjectRole('admin'), removeMember);
router.patch('/:projectId/archive', protect, checkProjectRole('admin'), archiveProject);
router.put('/:projectId', protect, checkProjectRole('admin'), updateProject);

module.exports = router;