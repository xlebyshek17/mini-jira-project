import { useState, useEffect } from 'react';
import authService from '../services/authService';

const ProfilePage = ({ user, onUserUpdate }) => {
    //const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        password: user?.password || ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const res = await authService.uploadAvatar(file);
            //setUser({ ...user, avatarUrl: res.avatarUrl });
            onUserUpdate();
            setMessage({ type: 'success', text: 'Zdjęcie zaktualizowane!' });
            window.location.reload(); 
        } catch (err) {
            setMessage({ type: 'danger', text: 'Błąd podczas wgrywania zdjęcia.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.updateProfile(formData);
            onUserUpdate();
            setMessage({ type: 'success', text: 'Profil zaktualizowany pomyślnie!' });
        } catch (err) {
            setMessage({ type: 'danger', text: 'Błąd podczas aktualizacji danych.' });
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-dark p-4 text-white text-center">
                            <h4 className="mb-0 fw-bold">Twój Profil</h4>
                        </div>
                        <div className="card-body p-5">
                            
                            <div className="text-center mb-5 position-relative">
                                <div className="d-inline-block position-relative">
                                    {user?.avatarUrl ? (
                                        <img 
                                            src={`http://localhost:5000${user.avatarUrl}`} 
                                            className="rounded-circle border shadow-sm"
                                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                            alt="Avatar"
                                        />
                                    ) : (
                                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center border shadow-sm mx-auto" 
                                             style={{ width: '150px', height: '150px', fontSize: '50px' }}>
                                            {user?.firstName?.charAt(0)}
                                        </div>
                                    )}
                                    <label htmlFor="avatar-upload" className="btn btn-light btn-sm rounded-circle position-absolute bottom-0 end-0 border shadow-sm p-2">
                                        📷 <input type="file" id="avatar-upload" hidden onChange={handleAvatarChange} accept="image/*" />
                                    </label>
                                </div>
                                <p className="text-muted small mt-3">Kliknij ikonę aparatu, aby zmienić zdjęcie</p>
                            </div>

                            {message.text && <div className={`alert alert-${message.type} text-center`}>{message.text}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-secondary">IMIĘ</label>
                                        <input name="firstName" className="form-control bg-light" value={formData.firstName} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-secondary">NAZWISKO</label>
                                        <input name="lastName" className="form-control bg-light" value={formData.lastName} onChange={handleChange} />
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-secondary">ADRES EMAIL</label>
                                        <input name="email" type="email" className="form-control bg-light" value={formData.email} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-secondary">HASŁO</label>
                                        <input name="password" type="password" className="form-control bg-light" value={formData.password} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="btn btn-dark btn-lg w-100 rounded-pill fw-bold">
                                        ZAPISZ ZMIANY
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;