import React from 'react';
import axios from 'axios';
import '../Modal.css';

const ModalDelete = ({ show, handleClose, user }) => {
  const handleDeleteUser = async () => {
    try {
      const apiUrl = 'http://localhost:3000/user';
      await axios.delete(`${apiUrl}/${user.id}`);
      console.log('User deleted successfully');
      handleClose(); 
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>Supprimer Utilisateur</h2>

        <div>
          <p>Êtes-vous sûr de vouloir supprimer l'utilisateur {user.name} ?</p>
          <button type="button" onClick={handleDeleteUser}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
