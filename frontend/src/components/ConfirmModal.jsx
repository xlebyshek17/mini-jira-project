const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Potwierdź akcję", 
    message = "Czy na pewno chcesz to zrobić?", 
    confirmText = "Potwierdź", 
    variant = "danger" 
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4">
                    <div className="modal-header border-0 p-4 pb-0">
                        <h5 className="modal-title fw-bold">{title}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-4">
                        <p className="text-secondary mb-0">{message}</p>
                    </div>
                    <div className="modal-footer border-0 p-4 pt-0 d-flex gap-2">
                        <button 
                            type="button" 
                            className="btn btn-light rounded-pill px-4 fw-bold" 
                            onClick={onClose}
                        >
                            Anuluj
                        </button>
                        <button 
                            type="button" 
                            className={`btn btn-${variant} rounded-pill px-4 fw-bold`} 
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;