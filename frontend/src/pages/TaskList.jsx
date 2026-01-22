import { useState } from 'react';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';

const TaskList = ({ projectId, tasks, isAdmin, onTaskClick, fetchTasks }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const [newTaskType, setNewTaskType] = useState('Task');

    const handleCreateTask = async () => {
        if (!newTaskTitle.trim()) {
            setIsAdding(false);
            return;
        }
        try {
            await taskService.createTask(projectId, { 
                title: newTaskTitle,
                type: newTaskType,
                priority: 'Medium'
            });
            setNewTaskTitle('');
            setNewTaskType('Task');
            setIsAdding(false);
            fetchTasks(); // Odświeżenie listy po dodaniu
        } catch (err) {
            console.error(err.response?.data);
            toast.error("Błąd: " + (err.response?.data?.error || "Nieznany błąd"));
        }
    };

    return (
        <div className="table-responsive rounded-3 shadow-sm bg-white">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.9rem' }}>
                <thead className="table-light">
                    <tr className="text-secondary small">
                        <th className="px-4 py-3" style={{ width: '30%' }}>WORK</th>
                        <th>TYPE</th>
                        <th>ASSIGNEE</th>
                        <th>REPORTER</th>
                        <th>PRIORITY</th>
                        <th>STATUS</th>
                        <th>DUE DATE</th>
                        <th className="text-end px-4">CREATED</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task._id} className="border-bottom" onClick={() => onTaskClick(task)}>
                            <td className="px-4 py-3 fw-bold">
                                <div className="d-flex align-items-center">
                                    <span className="text-primary me-2 small" style={{ minWidth: '60px' }}>
                                        KAN-{task._id.slice(-3)}
                                    </span>
                                    <span className="text-truncate" style={{ maxWidth: '250px' }}>
                                        {task.title}
                                    </span>
                                    {/* IKONA NOTATKI: Pojawia się tylko gdy description nie jest puste */}
                                    {task.description && (
                                        <span className="ms-2 text-secondary" title="To zadanie ma opis">📄</span>
                                    )}
                                </div>
                            </td>
                            <td>{task.type}</td>
                            <td>
                                {task.assignedTo ? (
                                    <div className="d-flex align-items-center gap-2">
                                        <img 
                                            src={`http://18.194.232.128:5000${task.assignedTo.avatarUrl}`} 
                                            className="rounded-circle" 
                                            style={{ width: '24px', height: '24px', objectFit: 'cover' }} 
                                            alt="Avatar"
                                        />
                                        <span>{task.assignedTo.firstName}</span>
                                    </div>
                                ) : (
                                    <span className="text-muted small">👤 Unassigned</span>
                                )}
                            </td>
                            <td>
                                <span className="badge bg-light text-dark border fw-normal">
                                    {task.reporter?.firstName[0]}{task.reporter?.lastName[0]}
                                </span>
                            </td>
                            <td>
                                <span className="text-warning fw-bold">＝ {task.priority}</span>
                            </td>
                            <td>
                                <span className={`badge rounded-1 px-2 py-1 text-uppercase ${
                                    task.status === 'To Do' ? 'bg-secondary' : 
                                    task.status === 'In Progress' ? 'bg-primary' : 'bg-success'
                                }`}>
                                    {task.status}
                                </span>
                            </td>
                            <td>
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString(): '-'}
                            </td>
                            <td className="text-end px-4 text-muted small">
                                {new Date(task.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                    
                    {/* WIERSZ SZYBKIEGO TWORZENIA */}
                    <tr>
                        <td colSpan="6" className="px-4 py-2">
                            {isAdding ? (
                                <div className="d-flex align-items-center gap-2">
                                    {/* Wybór typu zadania (ikona) */}
                                    <select 
                                        className="form-select form-select-sm w-auto border-0 bg-transparent fw-bold"
                                        value={newTaskType}
                                        onChange={(e) => setNewTaskType(e.target.value)}
                                    >
                                        <option value="Task">Task</option>
                                        <option value="Bug">Bug</option>
                                        <option value="Story">Feature</option>
                                    </select>

                                    <input 
                                        autoFocus
                                        type="text" 
                                        className="form-control form-control-sm border-primary shadow-sm"
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter') handleCreateTask();
                                            if(e.key === 'Escape') setIsAdding(false);
                                        }}
                                        placeholder="Co jest do zrobienia?"
                                    />
                                    <button className="btn btn-success btn-sm" onClick={handleCreateTask}>Add</button>
                                    <button className="btn btn-light btn-sm" onClick={() => setIsAdding(false)}>X</button>
                                </div>
                            ) : (
                                <button 
                                    className="btn btn-link text-decoration-none text-secondary fw-bold p-0 d-flex align-items-center"
                                    onClick={() => setIsAdding(true)}
                                >
                                    <span className="fs-4 me-2">+</span> Create
                                </button>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TaskList;