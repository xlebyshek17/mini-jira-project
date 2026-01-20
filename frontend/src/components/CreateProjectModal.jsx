import { useState } from 'react';
import projectService from '../services/projectService';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Jeśli 'isOpen' jest false, nie wyświetlamy nic
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Wysyłamy dane do Twojego kontrolera createProject
            const newProject = await projectService.createProject({ name, description });
            
            alert(`Projekt stworzony! Kod dołączenia: ${newProject.inviteCode}`); // inviteCode generowany przez crypto
            
            setName('');
            setDescription('');
            onProjectCreated(); // Ta funkcja odświeży listę w Sidebarze
            onClose(); // Zamykamy okno
        } catch (err) {
            alert(err.response?.data?.msg || "Błąd podczas tworzenia projektu");
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="modal-header bg-dark text-white border-0 py-3">
                        <h5 className="modal-title fw-bold">🚀 Stwórz nowy projekt</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4 bg-light">
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">NAZWA PROJEKTU</label>
                                <input 
                                    type="text" 
                                    className="form-control border-0 shadow-sm p-3" 
                                    placeholder="Wpisz nazwę..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">OPIS (OPCJONALNIE)</label>
                                <textarea 
                                    className="form-control border-0 shadow-sm p-3" 
                                    rows="3"
                                    placeholder="O czym jest ten projekt?"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer border-0 bg-light p-4">
                            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>Anuluj</button>
                            <button type="submit" className="btn btn-success rounded-pill px-4 fw-bold shadow-sm">Stwórz Projekt</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;