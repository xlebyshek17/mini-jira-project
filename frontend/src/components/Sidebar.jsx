import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import authService from '../services/authService';

const Sidebar = ({ onOpenCreateModal, onOpenJoinModal }) => {
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const navigate = useNavigate();

    // Pobieramy projekty, w których użytkownik uczestniczy
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
            } catch (err) {
                console.error("Nie udało się pobrać projektów", err);
            }
        };
        fetchProjects();
    }, []);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
       <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white border-end border-secondary shadow-sm" 
     style={{ width: '280px', height: 'calc(100vh - 56px)', position: 'fixed', top: '56px' }}>
            
            <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                    {user?.avatarUrl ? (
                        <img 
                            src={`http://localhost:5000${user.avatarUrl}`} 
                            alt="Avatar" 
                            className="rounded-circle border shadow-sm"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                    ) : (
                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center border shadow-sm mx-auto" 
                             style={{ width: '80px', height: '80px', fontSize: '30px', fontWeight: 'bold' }}>
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </div>
                    )}
                </div>
                <h5 className="mt-3 mb-0 fw-bold text-white">{user?.firstName} {user?.lastName}</h5>
                <p className=" small text-secondary">{user?.email}</p>
                
                <Link to="/profile" className="btn btn-secondary btn-sm w-100 mt-2 rounded-pill">
                    Mój Profil
                </Link>
            </div>

            <hr className="text-secondary"/>

            <div className="mb-auto overflow-auto">
                <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                    <span className="fw-bold text-secondary small">TWOJE PROJEKTY</span>
                    <button onClick={onOpenCreateModal} 
                            className="btn btn-sm btn-secondary text-white fw-bold" 
                            title="Nowy projekt">
                        +
                    </button>
                </div>

                <ul className="nav nav-pills flex-column mb-auto">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <li key={project._id} className="nav-item">
                                <Link to={`/projects/${project._id}`} className="nav-link text-white hover-dark-success d-flex align-items-center">
                                    <span className="text-truncate">{project.name}</span>
                                </Link>
                            </li>
                        ))
                        
                    ) : (
                        <div className="px-2 mt-3 text-center">
                            <p className="text-muted small">Brak aktywnych projektów.</p>
                        </div>
                    )}
                </ul>
            </div>

            

            <div className="mt-3">
                <hr className="text-secondary" />

                <button 
                    onClick={onOpenJoinModal}
                    className="btn btn-outline-info btn-sm w-100 mb-2 rounded-pill fw-bold"
                >
                     Dołącz kodem
                </button>

                <hr className="text-secondary"/>

                <button 
                    onClick={handleLogout} 
                    className="btn btn-danger btn-sm w-100 rounded-pill fw-bold"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;