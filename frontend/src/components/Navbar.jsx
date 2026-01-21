import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark border-bottom fixed-top" style={{ zIndex: 1030 }}>
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-extrabold text-info d-flex align-items-center" to="/profile" style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                     TaskFlow
                </Link>

                {/* <div className="d-none d-md-flex w-25" style={{ marginLeft: '150px' }}>
                    <input 
                        type="text" 
                        className="form-control form-control-sm bg-light border-0 rounded-pill px-3" 
                        placeholder="Szukaj zadań..." 
                    />
                </div> */}

                <div className="ms-auto d-flex align-items-center gap-3">
                    
                    <div className="position-relative ms-2" style={{ cursor: 'pointer' }}>
                        <span className="fs-5">🔔</span>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                            3
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;