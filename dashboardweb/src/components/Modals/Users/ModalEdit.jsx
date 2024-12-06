import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Modal.css';

const ModalEdit = ({ show, handleClose, user, handleEditUserSubmit }) => {
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: user?.password || '',
    address: user?.address || '',
    zipcode: user?.zipcode || '',
    city: user?.city || '',
    role: user?.role || '',
  });

  useEffect(() => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      password: user?.password || '',
      address: user?.address || '',
      zipcode: user?.zipcode || '',
      city: user?.city || '',
      role: user?.role || '',
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value,
    });
  };

  const handleEditUser = async () => {
    try {
      const apiUrl = 'http://localhost:3000/user';
      await axios.put(`${apiUrl}/${user.id}`, editedUser);
      console.log('User updated successfully');
      handleEditUserSubmit();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>Éditer Utilisateur</h2>

        <div>
          <form>
            <input type="text" name="name" value={editedUser.name} onChange={handleInputChange} />
            <input type="text" name="email" value={editedUser.email} onChange={handleInputChange} />
            <input type="text" name="password" value={editedUser.password} onChange={handleInputChange} />
            <input type="text" name="role" value={editedUser.role} onChange={handleInputChange} />
            <input type="text" name="address" value={editedUser.address} onChange={handleInputChange} />
            <input type="text" name="zipcode" value={editedUser.zipcode} onChange={handleInputChange} />
            <input type="text" name="city" value={editedUser.city} onChange={handleInputChange} />
            <button type="button" onClick={handleEditUser}>
              Enregistrer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;
