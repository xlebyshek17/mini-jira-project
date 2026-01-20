import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await authService.login(email, password);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.msg || 'Błędny login lub hasło!');
            console.error(err);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">

            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4 fw-bold text-success">Logowania</h2>

                    {error && <div className="alert alert-danger text-center">{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3"> 
                            <label className="form-label small fw-bold text-secondary">EMAIL</label>
                            <input
                                type="text"
                                className="form-control form-control-lg bg-light"
                                placeholder="Wpisz swój email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">HASŁO</label>
                            <input
                                type="password"
                                className="form-control form-control-lg bg-light" 
                                placeholder="Wpisz hasło"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-success btn-lg w-100 fw-bold shadow-sm mt-3">
                            ZALOGUJ SIĘ
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <span className="text-muted">Nie masz konta? </span>
                        <Link to="/register" className="text-decoration-none fw-bold text-success">Zarejestruj się</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;