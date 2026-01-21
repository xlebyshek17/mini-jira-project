import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';

const ProjectSettings = ({ project, isAdmin, isOwner, onProjectUpdated }) => {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || '');
    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await projectService.updateProject(project._id, { name, description });
            onProjectUpdated(); 
            alert("Ustawienia zapisane pomyślnie!");
        } catch (err) {
            alert("Błąd aktualizacji: " + (err.response?.data?.msg || err.message));
        }
    };

    const handleArchive = async () => {
        const action = project.status === 'active' ? 'zarchiwizować' : 'przywrócić';
        if (!window.confirm(`Czy na pewno chcesz ${action} ten projekt?`)) return;
        
        try {
            await projectService.archiveProject(project._id);
            await onProjectUpdated();
            alert(`Projekt został pomyślnie ${project.status === 'active' ? 'zarchiwizowany' : 'przywrócony'}.`);
        } catch (err) {
            alert("Błąd: " + err.response?.data?.msg);
        }
    };

    return (
        <div className="settings-view max-width-md mx-auto">
            <h5 className="fw-bold mb-4">Ustawienia projektu</h5>
            
            <form onSubmit={handleUpdate} className="bg-white p-4 rounded-3 shadow-sm mb-4">
                <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small text-uppercase">Nazwa projektu</label>
                    <input 
                        className="form-control bg-light border-0" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isAdmin}
                    />
                </div>
                <div className="mb-4">
                    <label className="form-label fw-bold text-secondary small text-uppercase">Opis</label>
                    <textarea 
                        className="form-control bg-light border-0" 
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={!isAdmin}
                    ></textarea>
                </div>
                {isAdmin && (
                    <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
                        Zapisz zmiany
                    </button>
                )}
            </form>

            {isOwner && (
                <div className="danger-zone border border-warning rounded-3 p-4 bg-warning-subtle">
                    <h6 className="text-dark fw-bold mb-2">Archiwizacja projektu</h6>
                    <p className="small text-muted mb-3">
                        Zarchiwizowane projekty znikną z list zadań innych członków. Tylko Ty będziesz mógł je przywrócić.
                    </p>
                    <button className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm" onClick={handleArchive}>
                        {project.status === 'active' ? 'Zarchiwizuj projekt' : 'Przywróć projekt'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectSettings;