import React from 'react';
import "../Modal.css";

const ModalView = ({ show, handleClose, user }) => {
  return (
    <div style={{ display: show ? 'block' : 'none' }}>
      <h2>Voir Utilisateur</h2>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Address: {user.address}</p>
      <p>Zipcode: {user.zipcode}</p>
      <p>City: {user.city}</p>
      <button onClick={handleClose}>Fermer</button>
    </div>
  );
};

export default ModalView;
