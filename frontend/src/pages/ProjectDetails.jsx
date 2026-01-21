import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import TaskList from '../pages/TaskList';
import TaskEditModal from '../components/TaskEditModal';
import TaskBoard from '../pages/TaskBoard';
import TaskViewModal from '../components/TaskViewModal';
import ProjectMembers from '../pages/ProjectMembers';
import ProjectSettings from './ProjectSetting';

const ProjectDetails = ({ refreshProjectList }) => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [activeTab, setActiveTab] = useState('board'); 
    const [tasks, setTasks] = useState([]);
    
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

    const currentMember = project?.members?.find(m => m.user._id === currentUserId);
    const isAdmin = currentMember?.role === 'admin';

    const availableTabs = project 
        ? (isAdmin ? ['list', 'board', 'members', 'settings'] : ['board', 'members'])
        : [];

    const fetchTasks = async () => {
        try {
            const data = await taskService.getProjectTasks(projectId);
            setTasks(data);
            if (selectedTask) {
                const updatedSelectedTask = data.find(t => t._id === selectedTask._id);
                if (updatedSelectedTask) {
                    setSelectedTask(updatedSelectedTask);
                }
            }
        } catch (err) {
            console.error("Błąd pobierania zadań", err);
        }
    };

    useEffect(() => {
        if (projectId) fetchTasks();
    }, [projectId]);

    const loadDetails = async () => {
        try {
            const data = await projectService.getProjectDetails(projectId);
            setProject(data);
            if (refreshProjectList) refreshProjectList();
        } catch (err) {
            console.error("Szczegóły błędu ładowania projektu:", err);
        }
    };

    useEffect(() => {
        if (projectId) loadDetails();
    }, [projectId]);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsEditModalOpen(true);
    };

    const handleTaskViewClick = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true); // Otwieramy nowe okno podglądu
};

    if (!project) return <div>Ładowanie projektu...</div>;

    return (
        <div className="project-view px-4">
            <div className="d-flex align-items-center mb-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item text-secondary">Projekty</li>
                        <li className="breadcrumb-item active fw-bold text-dark">{project.name}</li>
                        {project.status === 'archived' && (
                            <span className="badge bg-secondary-subtle text-secondary ms-3 border border-secondary-subtle rounded-pill px-3 py-2 fw-bold" style={{ fontSize: '0.7rem' }}>
                                <i className="bi bi-archive-fill me-1"></i> ARCHIVED
                            </span>
                        )}
                    </ol>
                </nav>
            </div>

            <ul className="nav nav-tabs border-bottom-0 mb-4 gap-3">
                {availableTabs.map((tab) => (
                    <li className="nav-item" key={tab}>
                        <button 
                            className={`nav-link border-0 fw-bold px-0 pb-2 ${activeTab === tab ? 'text-primary border-bottom border-primary border-3' : 'text-secondary'}`}
                            onClick={() => setActiveTab(tab)}
                            style={{ background: 'none' }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="tab-content bg-white rounded-3 shadow-sm p-4 min-vh-50">
                {activeTab === 'list' && (
                    <TaskList 
                        projectId={projectId} 
                        tasks={tasks} 
                        isAdmin={isAdmin} 
                        onTaskClick={handleTaskClick}
                        fetchTasks={fetchTasks}
                    />
                )}
                {activeTab === 'board' && <TaskBoard 
                                            tasks={tasks} 
                                            setTasks={setTasks}
                                            onTaskClick={handleTaskViewClick} 
                                        />}
                {activeTab === 'members' && (
                   <ProjectMembers 
                        members={project.members} 
                        projectId={projectId}
                        inviteCode={project.inviteCode}
                        ownerId={project.owner._id}
                        isAdmin={isAdmin} 
                        onMemberUpdated={() => {
                            loadDetails();
                            fetchTasks(); 
                        }}
                    />
                )}
                {activeTab === 'settings' && 
                    <ProjectSettings 
                        project={project}
                        isAdmin={isAdmin}
                        isOwner={project.owner._id === currentUserId} 
                        onProjectUpdated={loadDetails}
                    />
                }
            </div>

            <TaskEditModal 
                task={selectedTask}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onTaskUpdated={fetchTasks} 
                members={project?.members || []}
            />

            <TaskViewModal 
                task={selectedTask}
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                onTaskUpdated={fetchTasks}
            />
        </div>
    );
};

export default ProjectDetails;