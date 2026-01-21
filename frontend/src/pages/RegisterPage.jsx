import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService.js';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value 
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await authService.register(formData);
            toast.success("Rejestracja udana!!!");
            navigate('/login');
        } catch (err) {
            console.error(err);
            toast.error("Błąd rejestracji");
        }
    };

    return (
         <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light w-100 m-0 p-3">

            <div className="card shadow-lg" style={{ width: '100%', maxWidth: '500px', border: 'none', borderRadius: '20px' }}>
                <div className="card-body p-5">
                    <h2 className="text-center mb-4 fw-bold text-success">Załóż konto</h2>

                    <form onSubmit={handleRegister}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label small fw-bold text-secondary">IMIĘ</label>
                                <input
                                    name="firstName"
                                    type="text"
                                    className="form-control form-control-lg bg-light"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label small fw-bold text-secondary">NAZWISKO</label>
                                <input
                                    name="lastName"
                                    type="text"
                                    className="form-control form-control-lg bg-light"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">EMAIL</label>
                            <input
                                name="email"
                                type="email"
                                className="form-control form-control-lg bg-light"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">HASŁO</label>
                            <input
                                name="password"
                                type="password"
                                className="form-control form-control-lg bg-light"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-success btn-lg w-100 fw-bold shadow-sm mt-3">
                            ZAREJESTRUJ SIĘ
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <span className="text-muted">Masz już konto? </span>
                        <Link to="/login" className="text-decoration-none fw-bold text-success">Zaloguj się</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;