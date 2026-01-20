import projectService from '../services/projectService';

const ProjectMembers = ({ members, projectId, inviteCode, ownerId, isAdmin, onMemberUpdated }) => {
    const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

    const handleRoleChange = async (userId, newRole) => {
        try {
            await projectService.updateMemberRole(projectId, userId, newRole);
            onMemberUpdated(); 
        } catch (err) {
            alert("Błąd zmiany roli: " + err.response?.data?.msg);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tego członka?")) return;
        try {
            await projectService.removeMember(projectId, userId);
            onMemberUpdated();
        } catch (err) {
            alert("Błąd podczas usuwania: " + err.response?.data?.msg);
        }
    };

    return (
        <div>
            <p className="text-muted small">Kod zaproszenia: <strong className="text-success">{inviteCode}</strong></p>
            <div className="table-responsive bg-white rounded-3 shadow-sm">
            
                <table className="table align-middle mb-0">
                    <thead className="bg-light">
                        <tr className="small text-secondary text-uppercase">
                            <th className="px-4 py-3">Użytkownik</th>
                            <th>Rola</th>
                            <th className="text-end px-4">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((m) => {
                            const isOwner = m.user._id === ownerId; 
                            const isMe = m.user._id === currentUserId; 
                            return (
                            <tr key={m.user._id}>
                                <td className="px-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <img src={`http://localhost:5000${m.user.avatarUrl}`} className="rounded-circle border" style={{ width: '35px', height: '35px' }} alt="avatar" />
                                        <span className="fw-bold">
                                            {m.user.firstName} {m.user.lastName} 
                                            {isOwner && <span className="ms-2 badge bg-dark x-small">OWNER</span>}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    {isAdmin && !isOwner && !isMe ? (
                                        <select 
                                            className="form-select form-select-sm w-auto border-0 bg-light fw-bold"
                                            value={m.role}
                                            onChange={(e) => handleRoleChange(m.user._id, e.target.value)}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    ) : (
                                        <span className={`badge rounded-pill ${m.role === 'admin' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'}`}>
                                            {m.role}
                                        </span>
                                    )}
                                </td>
                                <td className="text-end px-4">
                                    {isAdmin && !isOwner && !isMe && (
                                        <button className="btn btn-sm text-danger" onClick={() => handleRemoveMember(m.user._id)}>
                                            Usuń
                                        </button>
                                    )}
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectMembers;