import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalAdd from '../../components/Modals/Users/ModalAdd';
import ModalEdit from '../../components/Modals/Users/ModalEdit';
import ModalDelete from '../../components/Modals/Users/ModalDelete';
import ModalView from '../../components/Modals/Users/ModalView';
import Header from '../../components/Header/Header';
import Navbar from '../../components/NavBar/NavBar';
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = 'http://localhost:3000/user';
        const response = await axios.get(apiUrl);
        setUsers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message || 'An error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalType('view');
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalType('edit');
  };

  const handleDeleteUser = (user) => {
    if (user) {
      setSelectedUser(user);
      setModalType('delete');
    }
  };

  const handleAddUser = () => {
    setModalType('add');
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="users-container">
      <Header />
      <main className="main">
      <Navbar />
        <div className="content">
          <div className="users_header">
            <h2>Users</h2>
            <button onClick={handleAddUser}>Ajouter un utilisateur</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Address</th>
                <th>Zipcode</th>
                <th>City</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.user_id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.address}</td>
                  <td>{user.zipcode}</td>
                  <td>{user.city}</td>
                  <td>
                    <button className="btn_see" onClick={() => handleViewUser(user)}>Voir</button>
                    <button className="btn_edit" onClick={() => handleEditUser(user)}>Éditer</button>
                    <button className="btn_del" onClick={() => handleDeleteUser(user)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedUser && modalType === 'view' && (
            <ModalView show={!!modalType} handleClose={handleCloseModal} user={selectedUser} />
          )}

          {selectedUser && modalType === 'delete' && (
            <ModalDelete
              show={!!modalType}
              handleClose={handleCloseModal}
              handleDeleteUser={handleDeleteUser}
              user={selectedUser}
            />
          )}

          {selectedUser && modalType === 'edit' && (
            <ModalEdit
              show={!!modalType}
              handleClose={handleCloseModal}
              handleEditUser={handleEditUser}
              user={selectedUser}
            />
          )}

          {modalType === 'add' && (
            <ModalAdd show={!!modalType} handleClose={handleCloseModal} handleAddUser={handleAddUser} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;
