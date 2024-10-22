import React, { useState } from 'react';
import BackgroundWrapper from '../BackgroundWrapper';

// UserRow Component
const UserRow = ({ name, email, role, onEdit, onDelete }) => {
    return (
      <article className="grid grid-cols-4 items-center gap-4 w-full border-b-[1px] border-b-white/40">
        <div className="col-span-1 py-5 px-5 text-white truncate">{name}</div>
        <div className="col-span-1 py-5 px-5 text-white truncate">{email}</div>
        <div className="col-span-1 py-5 px-5 text-white">{role}</div>
        <div className="col-span-1 flex gap-2 py-5 px-5">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-900 text-white rounded-full"
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
      <section className="w-full flex flex-col items-center">
        {/* Table Headers */}
        <header className="grid grid-cols-4 items-center gap-4 w-full border-b-2 border-b-white/40 pb-2">
          <div className="col-span-1 px-5 text-white font-bold">Name</div>
          <div className="col-span-1 px-5 text-white font-bold">Email</div>
          <div className="col-span-1 px-5 text-white font-bold">Role</div>
          <div className="col-span-1 px-5 text-white font-bold">Actions</div>
        </header>
  
        {/* User Rows */}
        {users.map((user) => (
          <UserRow
            key={user.id}
            name={user.name}
            email={user.email}
            role={user.role}
            onEdit={() => onEdit(user.id)}
            onDelete={() => onDelete(user.id)}
          />
        ))}
      </section>
    );
  };

export default function Admin() {
  const [selectedMenu, setSelectedMenu] = useState('Create New User');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    dob: '',
    allergies: '',
    extraComments: ''
  });
  const [message, setMessage] = useState('');

  const users = [
    { id: '1', name: 'Brianna Charney', email: 'Charney@gmail.com', role: 'Admin' },
    { id: '2', name: 'John Doe', email: 'john.doe@example.com', role: 'User' },
    { id: '3', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor' }
  ];

  const handleEdit = (id) => {
    console.log(`Edit user with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete user with id: ${id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulating form submission
    console.log('Form submitted:', formData);
    setMessage('User created successfully!');
    setFormData({
      name: '',
      email: '',
      address: '',
      dob: '',
      allergies: '',
      extraComments: ''
    });
  };

  const menuOptions = {
    "Create New User": "Fill in the form below to add a new user.",
    "Current Users": "Here is the list of current users."
  };

  return (
    <BackgroundWrapper>
      <div className="flex flex-col h-screen md:flex-row p-5">
        {/* Small Menu Card */}
        <div className="w-full h-auto mb-5 md:w-72 md:h-[500px] bg-gray-600/40 backdrop-blur-md p-5 rounded-xl md:mr-5 flex flex-col md:block justify-start overflow-x-auto md:overflow-visible border border-white/40 shadow-xl">
          <div className="border-b border-white/40 mb-5"></div>
          <h3 className="text-white mb-5 font-semibold">Admin Menu:</h3>

          <ul className="flex md:block overflow-x-scroll md:overflow-visible scrollbar-hide">
            {Object.keys(menuOptions).map(option => (
              <li
                key={option}
                onClick={() => setSelectedMenu(option)}
                className={`px-4 py-2 md:px-4 rounded-full text-white whitespace-nowrap cursor-pointer 
                  ${selectedMenu === option ? 'bg-white/10' : ''} 
                  hover:bg-white/10 transition duration-300`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>

        {/* Large Content Card */}
        <div className="flex-1 h-auto md:h-[650px] bg-gray-600/40 backdrop-blur-md p-5 rounded-xl flex flex-col items-center border border-white/40 shadow-xl">
          <h1 className="self-start text-white text-2xl font-semibold mb-8">{selectedMenu}:</h1>

          {selectedMenu === "Create New User" ? (
            <div className="w-full flex flex-col items-center">
              <form className="space-y-4 w-[60%]" onSubmit={handleSubmit}>
                {/* Form Fields */}
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/2 px-3">
                    <label className="block text-white text-sm font-bold mb-2">Name:</label>
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none"
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label className="block text-white text-sm font-bold mb-2">Email:</label>
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none"
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full md:w-1/2 px-3">
                    <label className="block text-white text-sm font-bold mb-2">Address:</label>
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none"
                      type="text"
                      name="address"
                      placeholder="Enter Address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label className="block text-white text-sm font-bold mb-2">DOB:</label>
                    <input
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* New Fields for Allergies and Extra Comments */}
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <label className="block text-white text-sm font-bold mb-2">Allergies:</label>
                    <textarea
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none"
                      name="allergies"
                      placeholder="Enter any allergies"
                      rows="2"
                      value={formData.allergies}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <label className="block text-white text-sm font-bold mb-2">Extra Comments:</label>
                    <textarea
                      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none"
                      name="extraComments"
                      placeholder="Enter any additional comments"
                      rows="2"
                      value={formData.extraComments}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Centered Submit Button */}
                <div className="flex justify-center">
                  <button className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full" type="submit">
                    Create User
                  </button>
                </div>
              </form>
              {message && <p className="text-white mt-4">{message}</p>}
            </div>
        ) : (
            <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </BackgroundWrapper>
  );
}
