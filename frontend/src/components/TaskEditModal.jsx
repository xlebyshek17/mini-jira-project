import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

const TaskEditModal = ({ task, isOpen, onClose, onTaskUpdated, members, isAdmin, isArchived }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        type: 'Task',
        link: '',
        dueDate: '',
        assignedTo: ''
    });

    // Wypełniamy formularz danymi zadania po otwarciu
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'Medium',
                type: task.type || 'Task',
                link: task.link || '',
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                assignedTo: task.assignedTo?._id || ''
            });
        }
    }, [task]);

    const handleDelete = async () => {
        try {
            await taskService.deleteTask(task._id);
            toast.success("Zadanie zostało usunięte");
            onTaskUpdated(); 
            onClose(); 
        } catch (err) {
            toast.error("Błąd podczas usuwania: " + (err.response?.data?.msg || err.message));
        }
    };

    if (!isOpen || !task) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await taskService.updateTask(task._id, formData);
            onTaskUpdated(); // Odświeżamy listę zadań
            onClose();
            toast.success('Zadanie zaktualizowane pomyślnie');
        } catch (err) {
            toast.error("Błąd podczas aktualizacji: " + err.response?.data?.msg);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-header border-0 p-4 pb-0">
                            <div className="d-flex align-items-center gap-2">
                                <select 
                                    className="form-select form-select-sm border-0 bg-light fw-bold w-auto"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="Task">Task</option>
                                    <option value="Bug">Bug</option>
                                    <option value="Feature">Feature</option>
                                </select>
                                <span className="text-muted small">KAN-{task._id.slice(-3)}</span>
                            </div>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>

                        <div className="modal-body p-4">
                            <input 
                                className="form-control form-control-lg border-0 fw-bold mb-3 p-0" 
                                style={{ fontSize: '1.75rem' }}
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Tytuł zadania"
                            />

                            <div className="mb-4">
                                <label className="form-label fw-bold text-secondary small">OPIS</label>
                                <textarea 
                                    className="form-control bg-light border-0 rounded-3 p-3" 
                                    rows="5"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Dodaj bardziej szczegółowy opis..."
                                ></textarea>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold text-secondary small">PRIORYTET</label>
                                    <select 
                                        className="form-select bg-light border-0"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold text-secondary small">TERMIN (DUE DATE)</label>
                                    <input 
                                        type="date" 
                                        className="form-control bg-light border-0"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold text-secondary small">WYKONAWCA (ASSIGNEE)</label>
                                    <select 
                                        className="form-select bg-light border-0"
                                        value={formData.assignedTo}
                                        onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                                    >
                                        <option value="">👤 Unassigned</option>
                                        {members.map((member) => (
                                            <option key={member.user._id} value={member.user._id}>
                                                {member.user.firstName} {member.user.lastName} ({member.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold text-secondary small text-uppercase">Link do zadania (Review Link)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0">🔗</span>
                                        <input 
                                            type="url"
                                            className="form-control bg-light border-0"
                                            placeholder="https://github.com/twoj-projekt"
                                            value={formData.link || ''}
                                            onChange={(e) => setFormData({...formData, link: e.target.value})}
                                        />
                                    </div>
                                </div>      
                            </div>
                        </div>

                        <div className="modal-footer border-0 p-4">
                            {isAdmin && !isArchived ? (
                                <button 
                                    type="button" 
                                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                    onClick={() => setShowDeleteConfirm(true)}
                                >
                                    Usuń zadanie
                                </button>
                            ) : (
                                <div className="text-muted small">
                                    {isArchived ? "⚠️ Projekt zarchiwizowany (edycja zablokowana)" : ""}
                                </div>
                            )}
                            <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>Anuluj</button>
                            {!isArchived && (
                                <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                                    Zapisz zmiany
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
            <ConfirmModal 
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Usuwanie zadania"
                message={`Czy na pewno chcesz trwale usunąć zadanie "${task.title}"?`}
                confirmText="Usuń trwale"
                variant="danger"
            />
        </div>
    );
};

export default TaskEditModal;