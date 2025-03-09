import React, { useEffect, useState } from 'react';
import { FaCheck, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from './api';
import { notify } from './utils';
import 'react-toastify/dist/ReactToastify.css';
import './TaskManager.css';

function TaskManager() {
    const [input, setInput] = useState('');
    const [tasks, setTasks] = useState([]);
    const [copyTasks, setCopyTasks] = useState([]);
    const [priority, setPriority] = useState('Medium');
    const [loading, setLoading] = useState(false);
    const [dueDate, setDueDate] = useState('');
    const [activePage, setActivePage] = useState('tasks');

    useEffect(() => {
        fetchAllTasks();
    }, []);

    const fetchAllTasks = async () => {
        setLoading(true);
        try {
            const { data } = await GetAllTasks();
            setTasks(data);
            setCopyTasks(data);
        } catch (err) {
            notify('Failed to fetch tasks', 'error');
        }
        setLoading(false);
    };

    const handleTask = async () => {
        if (!input) return notify('Task name is required', 'warning');
        const obj = {
            taskName: input,
            isDone: false,
            priority,
            dueDate
        };
        try {
            const { success, message } = await CreateTask(obj);
            notify(message, success ? 'success' : 'error');
            fetchAllTasks();
        } catch (err) {
            notify('Failed to create task', 'error');
        }
        setInput('');
        setPriority('Medium');
        setDueDate('');
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            const { success, message } = await DeleteTaskById(id);
            notify(message, success ? 'success' : 'error');
            fetchAllTasks();
        } catch (err) {
            notify('Failed to delete task', 'error');
        }
    };

    return (
        <div className='container mt-5 task-manager-bg'>
            <nav className='navbar navbar-expand-lg navbar-dark bg-primary mb-4'>
                <div className='container-fluid'>
                    <a className='navbar-brand' href='#' onClick={() => setActivePage('tasks')} style={{ cursor: 'pointer' }}>Project Management Tool</a>
                    <ul className='navbar-nav ms-auto'>
                        <li className='nav-item'><a className='nav-link' onClick={() => setActivePage('tasks')} style={{ cursor: 'pointer' }}>Tasks</a></li>
                        <li className='nav-item'><a className='nav-link' onClick={() => setActivePage('about')} style={{ cursor: 'pointer' }}>About</a></li>
                        <li className='nav-item'><a className='nav-link' onClick={() => setActivePage('login')} style={{ cursor: 'pointer' }}>Login</a></li>
                        <li className='nav-item'><a className='nav-link' onClick={() => setActivePage('signup')} style={{ cursor: 'pointer' }}>Sign Up</a></li>
                    </ul>
                </div>
            </nav>

            {activePage === 'tasks' && (
                <div>
                    <h1 className='text-center mb-4'>Tasks</h1>
                    <div className='task-input-section'>
                        <input type='text' className='form-control me-2' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Add Task' />
                        <select className='form-select me-2' value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value='Low'>Low</option>
                            <option value='Medium'>Medium</option>
                            <option value='High'>High</option>
                        </select>
                        <input type='date' className='form-control me-2' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        <button className='btn btn-success' onClick={handleTask}><FaPlus /></button>
                    </div>
                    {loading ? <p>Loading tasks...</p> : (
                        tasks.map((task) => (
                            <div key={task._id} className='task-item'>
                                <span className={task.isDone ? 'text-decoration-line-through' : ''}>
                                    {task.taskName} - <small>{task.priority} Priority</small> - <small>Due: {task.dueDate || 'N/A'}</small>
                                </span>
                                <button className='btn btn-danger btn-sm' onClick={() => handleDeleteTask(task._id)}><FaTrash /></button>
                            </div>
                        ))
                    )}
                </div>
            )}

        {activePage === 'about' && (
                        <div>
                            <h2>About</h2>
                            <p>Welcome to the <strong>Project Management Tool</strong>, a simple yet powerful platform designed to help you organize your tasks efficiently. Whether you're managing personal projects or team-based assignments, our tool ensures you stay on top of deadlines and priorities.</p>
                            <h3>Features:</h3>
                            <ul>
                                <li>✔️ Add, update, and delete tasks easily</li>
                                <li>✔️ Set priority levels to manage urgent tasks</li>
                                <li>✔️ Track task completion status</li>
                                <li>✔️ Search and sort tasks for better organization</li>
                                <li>✔️ User-friendly interface for seamless task management</li>
                            </ul>
                            <p>Our goal is to enhance productivity by providing a hassle-free task management experience. Stay organized and achieve your goals effortlessly! 🚀</p>
                        </div>
                    )}

            {activePage === 'login' && (
                <div>
                    <h2>Login</h2>
                    <input type='text' className='form-control mb-2' placeholder='Username' />
                    <input type='password' className='form-control mb-2' placeholder='Password' />
                    <button className='btn btn-primary'>Login</button>
                </div>
            )}

            {activePage === 'signup' && (
                <div>
                    <h2>Sign Up</h2>
                    <input type='text' className='form-control mb-2' placeholder='Full name' />
                    <input type='text' className='form-control mb-2' placeholder='Username' />
                    <input type='text' className='form-control mb-2' placeholder='Phone number' />
                    <input type='email' className='form-control mb-2' placeholder='Email' />
                    <input type='password' className='form-control mb-2' placeholder='Password' />
                    <input type='password' className='form-control mb-2' placeholder='Confirm password' />

                    <button className='btn btn-primary at-center'>Sign Up</button>
                </div>
            )}

            <footer className='footer mt-auto py-3 bg-black-light'>
                <div className='container'>
                    <p className='text-center'>&copy; 2025 Project Management Tool code with 🤝 Shrinivas Mudabe. All rights reserved.</p>
                </div>
            </footer>
            <ToastContainer position='bottom' autoClose={3000} hideProgressBar={false} />
        </div>
    );
}

export default TaskManager;