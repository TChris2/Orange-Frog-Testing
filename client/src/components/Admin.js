import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackgroundWrapper from '../BackgroundWrapper';

// UserRow Component
const UserRow = ({ name, email, status, onEdit, onDelete }) => {
    return (
        <article className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-b-white/40">
            <div className="col-span-1 py-5 px-5 text-white truncate">{name}</div>
            <div className="col-span-1 py-5 px-5 text-white truncate">{email}</div>
            <div className="col-span-1 py-5 px-5 text-white">{status}</div>
            <div className="col-span-1 flex gap-2 py-5 px-5">
                <button
                    onClick={onEdit}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full"
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-700 hover:bg-red-900 text-white rounded-full"
                >
                    Delete
                </button>
            </div>
        </article>
    );
};

// UserList Component
const UserList = ({ users, onEdit, onDelete }) => {
    return (
        <section className="w-full flex flex-col items-center mb-10">
            <header className="grid grid-cols-4 items-center gap-4 w-full border-b-2 border-b-white/40 pb-2">
                <div className="col-span-1 px-5 text-white font-bold">Name</div>
                <div className="col-span-1 px-5 text-white font-bold">Email</div>
                <div className="col-span-1 px-5 text-white font-bold">Status</div>
                <div className="col-span-1 px-5 text-white font-bold">Actions</div>
            </header>

            {users.map((user) => (
                <UserRow
                    key={user._id}
                    name={user.name}
                    email={user.email}
                    status={user.temporaryPassword ? 'Pending' : 'Active'}
                    onEdit={() => onEdit(user._id)}
                    onDelete={() => onDelete(user._id)}
                />
            ))}
        </section>
    );
};

// Confirmation Popup Component
const ConfirmationPopup = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md">
                <h2 className="text-red-600 text-2xl mb-4">Are you sure you want to delete this user?</h2>
                <p className="text-gray-700 mb-6">
                    This action cannot be undone. Once deleted, this user's data will be permanently removed from the system.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-700 hover:bg-red-900 text-white rounded-full"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Admin() {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false); 
    const [selectedUser, setSelectedUser] = useState(null); 

    // Fetch users from the backend
    useEffect(() => {
        axios.get('http://localhost:8000/users')
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    const handleEdit = (id) => {
        console.log(`Edit user with id: ${id}`);
    };

    const handleDelete = (id) => {
        setSelectedUser(id);  
        setShowPopup(true);   
    };

    const confirmDelete = () => {
        axios.delete(`http://localhost:8000/delete-user/${selectedUser}`)
            .then(() => {
                setUsers((prevUsers) => prevUsers.filter(user => user._id !== selectedUser));
                setShowPopup(false);  
            })
            .catch((error) => console.error('Error deleting user:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/create-user', formData)
            .then((response) => {
                setMessage(response.data.message);
                setUsers((prevUsers) => [...prevUsers, response.data.user]);
                setFormData({ name: '', email: '' });
                setShowForm(false);
            })
            .catch((error) => console.error('Error creating user:', error));
    };

    const handleCancel = () => {
        setFormData({ name: '', email: '' });
        setShowForm(false);
    };

    return (
        <BackgroundWrapper>
            <div className="flex flex-col h-screen md:flex-row p-5">
                <div className="w-full h-auto mb-5 md:w-72 md:h-[500px] bg-gray-400/40 backdrop-blur-md p-5 rounded-xl md:mr-5 flex flex-col justify-start border border-white/40 shadow-xl">
                    <h3 className="text-white mb-5 font-semibold">Admin Menu:</h3>
                    <button
                        onClick={() => setShowForm(false)}
                        className={`px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full mb-4`}
                    >
                        Manage Users
                    </button>
                </div>

                <div className="flex-1 h-auto md:h-[650px] bg-gray-400/40 backdrop-blur-md p-5 rounded-xl flex flex-col items-center border border-white/40 shadow-xl">
                    <div className="w-full flex justify-between items-center mb-5">
                        <h1 className="text-white text-2xl font-semibold whitespace-nowrap">Current Users:</h1>
                        <div className="w-full flex justify-end">
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-4 py-2 bg-white text-black hover:bg-gray-300 rounded-full transition duration-3000 ease-in-out"
                                    style={{ width: '170px' }}
                                >
                                    <span className="mr-2">+</span> Add New User
                                </button>
                            )}

                            {showForm && (
                                <form
                                    className={`flex items-center space-x-2 w-full justify-end transition-all duration-5000 ease-in-out transform ${showForm ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
                                    onSubmit={handleSubmit}
                                >
                                    <input
                                        className="appearance-none border rounded py-2 px-3 text-black leading-tight focus:outline-none w-[20%] my-3"
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        className="appearance-none border rounded py-2 px-3 text-black leading-tight focus:outline-none w-[30%]"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-4 rounded-full my-0"
                                        type="submit"
                                        style={{ height: '38px', width: '140px' }}
                                    >
                                        Create User
                                    </button>
                                    <button
                                        className="bg-red-700 hover:bg-red-900 text-white font-bold py-1 px-4 rounded-full my-0"
                                        type="button"
                                        onClick={handleCancel}
                                        style={{ height: '38px', width: '140px' }}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />

                    {showPopup && (
                        <ConfirmationPopup
                            onConfirm={confirmDelete}
                            onCancel={() => setShowPopup(false)}  
                        />
                    )}
                </div>
            </div>
        </BackgroundWrapper>
    );
}
