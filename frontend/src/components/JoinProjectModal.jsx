import { useState } from 'react';
import projectService from '../services/projectService';
import { toast } from 'react-toastify';

const JoinProjectModal = ({ isOpen, onClose, onProjectJoined }) => {
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const joinedProject = await projectService.joinProject(inviteCode);
            
            toast.success(joinedProject.msg);
            
            setInviteCode('');
            onProjectJoined(joinedProject);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.msg || "Wystąpił błąd podczas dołączania");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-dark text-white border-0 py-3">
                        <h5 className="modal-title fw-bold"> Dołącz do projektu</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4 bg-light text-center">
                            <p className="text-muted mb-4">Wprowadź 6-znakowy kod otrzymany od właściciela projektu.</p>
                            
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary text-uppercase">Kod zaproszenia</label>
                                <input 
                                    type="text" 
                                    className="form-control border-0 shadow-sm p-3 text-center fw-bold fs-4 text-success" 
                                    placeholder="np. AF31B2"
                                    maxLength="6"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                    style={{ letterSpacing: '5px' }}
                                    required 
                                />
                            </div>
                        </div>
                        <div className="modal-footer border-0 bg-light p-4 pt-0">
                            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>Anuluj</button>
                            <button 
                                type="submit" 
                                className="btn btn-success rounded-pill px-4 fw-bold shadow-sm"
                                disabled={loading || inviteCode.length < 6}
                            >
                                {loading ? 'Łączenie...' : 'Dołącz teraz'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinProjectModal;