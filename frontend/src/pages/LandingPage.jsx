import { Link, Navigate } from 'react-router-dom';
import authService from '../services/authService';

const LandingPage = () => {
    // Jeśli użytkownik jest już zalogowany, przenieś go od razu do projektów
    const user = authService.getCurrentUser();
    if (user) {
        return <Navigate to="/profile" />;
    }

    return (
        <div className="landing-page bg-light min-vh-100 d-flex align-items-center">
            <div className="container text-center">
                <div className="row justify-content-center py-5">
                    <div className="col-md-8">
                        <div className="mb-4">
                            <i className="bi bi-ui-checks text-primary" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h1 className="display-3 fw-bold text-dark mb-3">TaskFlow</h1>
                        <p className="lead text-secondary mb-5">
                            Zarządzaj swoimi projektami z lekkością. TaskFlow to proste, ale potężne 
                            narzędzie do śledzenia zadań i współpracy z zespołem.
                        </p>
                        <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                            <Link to="/login" className="btn btn-primary btn-lg px-4 gap-3 rounded-pill shadow-sm fw-bold">
                                Zaloguj się
                            </Link>
                            <Link to="/register" className="btn btn-outline-secondary btn-lg px-4 rounded-pill fw-bold">
                                Załóż konto
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="row mt-5 g-4">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4">
                            <i className="bi bi-kanban fs-1 text-primary mb-3"></i>
                            <h3 className="h5 fw-bold">Tablica Kanban</h3>
                            <p className="text-muted small">Przeciągaj zadania między kolumnami i wizualizuj postęp prac.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4">
                            <i className="bi bi-shield-check fs-1 text-primary mb-3"></i>
                            <h3 className="h5 fw-bold">Role Projektowe</h3>
                            <p className="text-muted small">Zarządzaj uprawnieniami administratorów i użytkowników.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm p-4">
                            <i className="bi bi-bell fs-1 text-primary mb-3"></i>
                            <h3 className="h5 fw-bold">Powiadomienia</h3>
                            <p className="text-muted small">Otrzymuj powiadomienia o nowych zadaniach i komentarzach.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;