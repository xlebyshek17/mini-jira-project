import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CreateProjectModal from './CreateProjectModal';
import JoinProjectModal from './JoinProjectModal';
import React, { useState, useEffect } from 'react';
import projectService from '../services/projectService';

const MainLayout = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [myProjects, setMyProjects] = useState([]);

    const fetchMyProjects = async () => {
        try {
            const data = await projectService.getMyProjects();
            setMyProjects(data);
        } catch (err) {
            console.error("Błąd sidebaru:", err);
        }
    };

    useEffect(() => {
        fetchMyProjects();
    }, []);

    return (
        <div className="min-vh-100 bg-light">
            <Navbar />

            <div className="d-flex">
                <div style={{ paddingTop: '56px' }}>
                    <Sidebar 
                        onOpenCreateModal={() => setIsModalOpen(true)}
                        onOpenJoinModal={() => setIsJoinModalOpen(true)}
                        projects={myProjects}
                    />
                </div>

                <main className="flex-grow-1" style={{ marginLeft: '280px', paddingTop: '76px', paddingInline: '30px' }}>
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, { refreshProjectList: fetchMyProjects });
                        }
                        return child;
                    })}
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