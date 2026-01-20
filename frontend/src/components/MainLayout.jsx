import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CreateProjectModal from './CreateProjectModal';
import JoinProjectModal from './JoinProjectModal';
import { useState } from 'react';

const MainLayout = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    return (
        <div className="min-vh-100 bg-light">
            <Navbar />

            <div className="d-flex">
                <div style={{ paddingTop: '56px' }}>
                    <Sidebar 
                        onOpenCreateModal={() => setIsModalOpen(true)}
                        onOpenJoinModal={() => setIsJoinModalOpen(true)} />
                </div>

                <main className="flex-grow-1" style={{ marginLeft: '280px', paddingTop: '76px', paddingInline: '30px' }}>
                    { children }
                </main>
            </div>

            <CreateProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={() => {window.location.reload();}}
            />
            <JoinProjectModal 
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onProjectJoined={() => window.location.reload()} 
            />
        </div>
    );
};

export default MainLayout;