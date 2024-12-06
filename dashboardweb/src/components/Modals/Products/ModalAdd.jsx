import React, { useState } from 'react';
import axios from 'axios';
import '../Modal.css';

const ModalAdd = ({ show, handleClose, handleAddUserSubmit }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    zipcode: '',
    city: '',
    role: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  const handleAddUser = async () => {
    try {
      const apiUrl = 'http://localhost:3000/user';
      await axios.post(apiUrl, newUser);
      console.log('User added successfully');
      handleAddUserSubmit(); 
    } catch (error) {
      console.error('Error adding user:', error);
    
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>Ajouter Utilisateur</h2>

        <div>
          <form>
            <input type="text" name="name" value={newUser.name} onChange={handleInputChange} />
            <input type="text" name="email" value={newUser.email} onChange={handleInputChange} />
            <input type="text" name="password" value={newUser.password} onChange={handleInputChange} />
            <input type="text" name="role" value={newUser.role} onChange={handleInputChange} />
            <input type="text" name="address" value={newUser.address} onChange={handleInputChange} />
            <input type="text" name="zipcode" value={newUser.zipcode} onChange={handleInputChange} />
            <input type="text" name="city" value={newUser.city} onChange={handleInputChange} />
            <button type="button" onClick={handleAddUser}>
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAdd;
