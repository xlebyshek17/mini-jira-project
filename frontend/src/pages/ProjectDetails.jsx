import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import TaskList from '../pages/TaskList';
import TaskEditModal from '../components/TaskEditModal';

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [activeTab, setActiveTab] = useState('board'); 
    const [taskTitle, setTaskTitle] = useState('');
    const [tasks, setTasks] = useState([]);
    
    const [selectedTask, setSelectedTask] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        } catch (err) {
            console.error("Błąd pobierania zadań", err);
        }
    };

    useEffect(() => {
        if (projectId) fetchTasks();
    }, [projectId]);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const data = await projectService.getProjectDetails(projectId);
                setProject(data);
                
            } catch (err) {
                console.error("Szczegóły błędu:", err);
            }
        };
        loadDetails();
    }, [projectId]);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setIsEditModalOpen(true);
    };

    if (!project) return <div>Ładowanie projektu...</div>;

    return (
        <div className="project-view px-4">
            <div className="d-flex align-items-center mb-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item text-secondary">Projekty</li>
                        <li className="breadcrumb-item active fw-bold text-dark">{project.name}</li>
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
                {activeTab === 'board' && <div>Tutaj będzie Twój Kanban (widok Board)</div>}
                {activeTab === 'members' && (
                    <div>
                        <h5>Zarządzanie użytkownikami</h5>
                        <p className="text-muted small">Kod zaproszenia: <strong className="text-success">{project.inviteCode}</strong></p>
                        
                    </div>
                )}
                {activeTab === 'settings' && <div>Ustawienia projektu i archiwizacja</div>}
            </div>

            <TaskEditModal 
                task={selectedTask}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onTaskUpdated={fetchTasks} 
                members={project?.members || []}
            />
        </div>
    );
};

export default ProjectDetails;