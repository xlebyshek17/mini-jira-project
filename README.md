# TaskFlow — Project Management System

TaskFlow is a modern, full-stack project management application inspired by Jira and Trello. It allows teams to collaborate on projects, track tasks via a Kanban board, manage roles, and receive real-time updates.

## 🚀 Features

- **Authentication & Security**: Secure login and registration using JWT (JSON Web Tokens).
- **Project Workspaces**: 
  - Create and join projects via unique invite codes.
  - Role-based access control (Owner, Admin, User).
  - Archive projects to prevent further modifications.
- **Task Management**:
  - Full CRUD operations for tasks.
  - Task types: Bug, Feature, Task.
  - Priority levels and due dates.
  - Assignment system (Assignee/Reporter).
  - Interactive Kanban board for status updates.
- **Collaboration**: 
  - Comments section for every task.
  - Link sharing (GitHub/Review links) per task.
- **Real-time Notifications**: Instant alerts for mentions, comments, and task assignments.
- **Profile Management**: Customizable user profiles with avatar uploads.

## 🛠 Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router** (Navigation)
- **Axios** (API Requests)
- **React-Toastify** (Notifications/Toasts)
- **Bootstrap 5** (UI/Styling)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Database)
- **JWT** (Authentication)
- **Multer** (File Uploads)

## 📦 Installation

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/taskflow.git](https://github.com/xlebyshek17/mini-jira-project.git)
cd mini-jira-project
