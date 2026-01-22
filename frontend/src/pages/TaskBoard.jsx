import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';

const TaskBoard = ({ tasks, setTasks, onTaskClick, isArchived }) => {
    const columns = ['To Do', 'In Progress', 'In Review', 'Done'];
    const [taskFilter, setTaskFilter] = useState('all');
    const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

    const filteredTasks = tasks.filter(task => {
        if (taskFilter === 'all') return true;
        
        const assignedId = task.assignedTo?._id || task.assignedTo;
        return assignedId === currentUserId;
    });

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        // Jeśli upuszczono poza tablicę lub w to samo miejsce nic nie rób
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const newStatus = destination.droppableId; // droppableId to u nas nazwa statusu
        const oldTasks = [...tasks];

        const updatedTasks = tasks.map(task => 
            task._id === draggableId 
                ? { ...task, status: newStatus } 
                : task
        );
        setTasks(updatedTasks);

        try {
            await taskService.updateTaskStatus(draggableId, newStatus);
        } catch (err) {
            setTasks(oldTasks);
            toast.error("Błąd zmiany statusu: " + (err.response?.data?.msg || err.message));
        }
    };

    return (
        <div>
            <div className="btn-group bg-white p-1 rounded-pill shadow-sm border mb-4">
                <button 
                    className={`btn btn-sm rounded-pill px-3 ${taskFilter === 'all' ? 'btn-primary fw-bold' : 'btn-light text-secondary border-0'}`}
                    onClick={() => setTaskFilter('all')}
                >
                    Wszystkie
                </button>
                <button 
                    className={`btn btn-sm rounded-pill px-3 ${taskFilter === 'mine' ? 'btn-primary fw-bold' : 'btn-light text-secondary border-0'}`}
                    onClick={() => setTaskFilter('mine')}
                 >
                    Moje zadania
                </button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="d-flex gap-3 overflow-auto pb-4" style={{ minHeight: '70vh' }}>
                    {columns.map(status => (
                        <Droppable droppableId={status} key={status}>
                            {(provided) => (
                                <div 
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="bg-light rounded-3 p-3" 
                                    style={{ minWidth: '300px', width: '300px' }}
                                >
                                    <h6 className="fw-bold text-secondary text-uppercase mb-3">{status}</h6>
                                    
                                    <div className="d-flex flex-column gap-3">
                                        {filteredTasks.filter(t => t.status === status).map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index} isDragDisabled={isArchived}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="card border-0 shadow-sm p-3 bg-white"
                                                        onClick={() => onTaskClick(task)}
                                                    >
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span className="text-primary x-small fw-bold">KAN-{task._id.slice(-3)}</span>
                                                            <span>{task.type}</span>
                                                        </div>
                                                        <p className="mb-2 small fw-bold">{task.title}</p>
                                                        <div className="d-flex justify-content-end">
                                                            {task.assignedTo ? (
                                                                <img 
                                                                    src={`http://18.194.232.128:5000${task.assignedTo.avatarUrl}`} 
                                                                    className="rounded-circle" 
                                                                    style={{ width: '24px', height: '24px', objectFit: 'cover' }} 
                                                                    alt="Avatar"
                                                                />
                                                            ) : (
                                                                <span className="text-muted small">👤</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

// Funkcje pomocnicze dla wyglądu
const getPriorityColor = (priority) => {
    if (priority === 'High') return '#dc3545';
    if (priority === 'Medium') return '#ffc107';
    return '#198754';
};

const getTypeIcon = (type) => {
    if (type === 'Bug') return '🐞';
    if (type === 'Feature') return '🚀';
    return '✅';
};

export default TaskBoard;