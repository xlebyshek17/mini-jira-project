import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CreateProjectModal from './CreateProjectModal';
import JoinProjectModal from './JoinProjectModal';
import React, { useState, useEffect } from 'react';
import projectService from '../services/projectService';
import { useNavigate } from 'react-router';

const MainLayout = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [myProjects, setMyProjects] = useState([]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const navigate = useNavigate();

    const refreshUserData = () => {
        const updatedUser = JSON.parse(localStorage.getItem('user'));
        setUser(updatedUser);
    };

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
                        user={user}
                    />
                </div>

                <main className="flex-grow-1" style={{ marginLeft: '280px', paddingTop: '76px', paddingInline: '30px' }}>
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, {
                                user: user, 
                                refreshProjectList: fetchMyProjects,
                                onUserUpdate: refreshUserData
                            });
                        }
                        return child;
                    })}
                </main>
            </div>

            <CreateProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={async (newProject) => {
                    setIsModalOpen(false); 
                    await fetchMyProjects(); 
                    if (newProject && newProject._id) {
                        navigate(`/projects/${newProject._id}`); 
                    } 
                }}
            />
            <JoinProjectModal 
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onProjectJoined={async (joinedProject) => {
                    await fetchMyProjects();
                    if (joinedProject && joinedProject._id) {
                        navigate(`/projects/${joinedProject._id}`);
                    }
                }}
            />
        </div>
    );
};

export default MainLayout;