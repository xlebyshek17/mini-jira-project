import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';

const TaskViewModal = ({ task, isOpen, onClose, onTaskUpdated }) => {
    const [comment, setComment] = useState('');
    const [isEditingLink, setIsEditingLink] = useState(false);
    const [tempLink, setTempLink] = useState('');

    useEffect(() => {
        if (task) {
            setTempLink(task.link || '');
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await taskService.addTaskComment(task._id, comment);
            setComment('');
            onTaskUpdated(); // Odświeżamy zadanie, by zobaczyć nowy komentarz
        } catch (err) {
            toast.error("Błąd podczas dodawania komentarza");
        }
    };

    const handleLinkUpdate = async () => {
        try {
            await taskService.updateLink(task._id, tempLink);
            setIsEditingLink(false);
            onTaskUpdated();
        } catch (err) {
            toast.error("Błąd aktualizacji linku");
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100 }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden" style={{ minHeight: '80vh' }}>
                    
                    <div className="modal-header border-0 px-4 py-3 bg-white d-flex justify-content-between">
                        <div className="d-flex align-items-center gap-2 text-secondary small fw-bold">
                            <span>{task.type === 'Bug' ? '🐞' : '✅'}</span>
                            <span>KAN-{task._id.slice(-3)}</span>
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-0 d-flex bg-white">
                        {/* LEWA STRONA: Treść i Komentarze */}
                        <div className="col-lg-8 p-4 overflow-auto border-end" style={{ maxHeight: '70vh' }}>
                            <h2 className="fw-bold mb-4">{task.title}</h2>
                            
                            <div className="mb-5">
                                <label className="fw-bold text-secondary mb-2 small text-uppercase">Description</label>
                                <div className="p-3 bg-light rounded-3">
                                    {task.description || <span className="text-muted italic">No description provided.</span>}
                                </div>
                            </div>

                            {/* Sekcja Activity / Komentarze */}
                            <div className="activity-section">
                                <h6 className="fw-bold mb-4">Activity</h6>
                                
                                <div className="comments-list mb-4">
                                    {task.comments?.length > 0 ? (
                                        task.comments.map((c, index) => (
                                            <div key={index} className="d-flex gap-3 mb-4">
                                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '35px', height: '35px', flexShrink: 0 }}>
                                                    {c.author?.firstName ? c.author.firstName[0] : '?'}
                                                </div>
                                                <div>
                                                    <div className="small fw-bold">{c.author?.firstName} {c.author?.lastName}</div>
                                                    <div className="bg-light p-3 rounded-3 mt-1 shadow-sm">
                                                        {c.text}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted small">No comments yet.</p>
                                    )}
                                </div>

                                {/* Formularz komentarza */}
                                <form onSubmit={handleAddComment} className="d-flex gap-3 mt-4">
                                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>ME</div>
                                    <div className="flex-grow-1">
                                        <textarea 
                                            className="form-control border-2" 
                                            placeholder="Add a comment..."
                                            rows="2"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        ></textarea>
                                        {comment.trim() && (
                                            <button type="submit" className="btn btn-primary btn-sm mt-2 px-4 rounded-pill">Send</button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* PRAWA STRONA: Szczegóły (Sidebar) */}
                        <div className="col-lg-4 p-4 bg-white">
                            <div className="mb-4">
                                <label className="text-secondary small fw-bold text-uppercase d-block mb-2">Status</label>
                                <span className={`badge px-3 py-2 text-uppercase ${task.status === 'Done' ? 'bg-success' : 'bg-primary'}`}>
                                    {task.status}
                                </span>
                            </div>

                            <div className="border rounded-3 p-3">
                                <h6 className="fw-bold mb-3 small border-bottom pb-2">Details</h6>
                                <div className="d-flex flex-column gap-3">
                                    <div className="row small">
                                        <div className="col-5 text-secondary">Assignee</div>
                                        <div className="col-7 fw-bold">
                                            {task.assignedTo ? (
                                                <div className="d-flex align-items-center gap-2">
                                                    <img src={`http://18.194.232.128:5000${task.assignedTo.avatarUrl}`} className="rounded-circle" style={{ width: '20px', height: '20px' }} alt="" />
                                                    {task.assignedTo.firstName} {task.assignedTo.lastName}
                                                </div>
                                            ) : 'Unassigned'}
                                        </div>
                                    </div>
                                    <div className="row small">
                                        <div className="col-5 text-secondary">Priority</div>
                                        <div className="col-7">
                                            <span className={`fw-bold ${task.priority === 'High' ? 'text-danger' : 'text-warning'}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="row small">
                                        <div className="col-5 text-secondary">Due Date</div>
                                        <div className="col-7 fw-bold">
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
                                        </div>
                                    </div>
                                    <div className="row small mb-3">
                                        <div className="col-5 text-secondary">Review Link</div>
                                        <div className="col-7">
                                            {isEditingLink ? (
                                                <div className="d-flex gap-1">
                                                    <input 
                                                        className="form-control form-control-sm" 
                                                        value={tempLink}
                                                        onChange={(e) => setTempLink(e.target.value)}
                                                    />
                                                    <button className="btn btn-sm btn-success" onClick={handleLinkUpdate}>✓</button>
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center gap-2">
                                                    {task.link ? (
                                                        <a href={task.link} target="_blank" rel="noreferrer" className="text-truncate d-block fw-bold">Otwórz</a>
                                                    ) : (
                                                        <span className="text-muted small">Brak</span>
                                                    )}
                                                    <button className="btn btn-sm p-0 text-primary" onClick={() => setIsEditingLink(true)}>✎</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskViewModal;