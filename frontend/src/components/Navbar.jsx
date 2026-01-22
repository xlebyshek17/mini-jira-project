import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import notificationService from '../services/notificationService';

const Navbar = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const data = await notificationService.getNotifications();
            if (Array.isArray(data)) {
                setNotifications(data);
            } else {
                setNotifications([]);
            }
        } catch (err) {
            console.error("Błąd pobierania powiadomień", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Możesz dodać interwał, aby sprawdzać powiadomienia co minutę
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-dark border-bottom fixed-top" style={{ zIndex: 1030 }}>
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-extrabold text-info d-flex align-items-center" to="/profile" style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                     TaskFlow
                </Link>

                <div className="ms-auto d-flex align-items-center gap-3">
                <div className="dropdown">
                    <button className="btn btn-link p-0 position-relative" onClick={() => setIsOpen(!isOpen)}>
                        <span className="fs-5">🔔</span>
                        {unreadCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {isOpen && (
                        <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg border-0 rounded-3 p-0" style={{ width: '320px', maxHeight: '400px', overflowY: 'auto' }}>
                            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                                <span className="fw-bold small">Powiadomienia</span>
                                <span className="badge bg-primary-subtle text-primary">{unreadCount} nowe</span>
                            </div>
                            
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-muted small">Brak powiadomień</div>
                            ) : (
                                notifications.slice(0, 5).map(n => (
                                    <Link 
                                        to={`/projects/${n.project?._id}`} 
                                        key={n._id}
                                        className={`dropdown-item p-3 border-bottom d-flex gap-3 align-items-start ${!n.isRead ? 'bg-primary-subtle bg-opacity-10' : ''}`}
                                        onClick={() => {
                                            handleMarkAsRead(n._id);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="fs-5">
                                            {n.type === 'TASK_DONE' ? '✅' : n.type === 'NEW_COMMENT' ? '💬' : '📌'}
                                        </div>
                                        <div>
                                            <div className="small fw-bold text-dark" style={{ whiteSpace: 'normal' }}>
                                                {n.project?.name || 'Usunięty projekt'}
                                            </div>
                                            <div className="small text-dark" style={{ whiteSpace: 'normal' }}>{n.message}</div>
                                            <div className="x-small text-muted mt-1">
                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
            </div>
        </nav>
    );
};

export default Navbar;