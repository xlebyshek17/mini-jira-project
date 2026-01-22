import  { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Sidebar = ({ onOpenCreateModal, onOpenJoinModal, projects, user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    // Stan filtra: 'active' lub 'archived'
    const [filter, setFilter] = useState('active');

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const filteredProjects = projects.filter(p => p.status === filter);

    return (
       <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white border-end border-secondary shadow-sm" 
     style={{ width: '280px', height: 'calc(100vh - 56px)', position: 'fixed', top: '56px' }}>
            
            <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                    {user?.avatarUrl ? (
                        <img 
                            src={`http://18.194.232.128:5000${user.avatarUrl}`} 
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

                <div className="d-flex gap-2 mb-3 bg-black bg-opacity-25 p-1 rounded-3">
                    <button 
                        className={`btn btn-sm flex-grow-1 rounded-2 border-0 ${filter === 'active' ? 'btn-secondary fw-bold' : 'text-secondary'}`}
                        onClick={() => setFilter('active')}
                        style={{ fontSize: '0.7rem' }}
                    >
                        Aktywne
                    </button>
                    <button 
                        className={`btn btn-sm flex-grow-1 rounded-2 border-0 ${filter === 'archived' ? 'btn-secondary fw-bold' : 'text-secondary'}`}
                        onClick={() => setFilter('archived')}
                        style={{ fontSize: '0.7rem' }}
                    >
                        Archiwum
                    </button>
                </div>

                <ul className="nav flex-column gap-1">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map(project => (
                            <li className="nav-item" key={project._id}>
                                <Link 
                                    to={`/projects/${project._id}`}
                                    className={`nav-link rounded-3 py-2 px-3 d-flex justify-content-between align-items-center ${location.pathname.includes(project._id) ? 'bg-secondary text-white' : 'text-light'}`}
                                >
                                    <span className="text-truncate" style={{ maxWidth: '180px' }}>{project.name}</span>
                                    {project.status === 'archived' && <span>🔒</span>}
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="nav-item ps-3">
                            <small className="text-secondary italic">Brak projektów</small>
                        </li>
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