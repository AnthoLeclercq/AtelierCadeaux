import React, {useState, useEffect} from "react";
import "./Header.css";
import logo from "../../assets/images/logo.png";
import profilepic from "../../assets/images/profilepic.jpg";
import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Header() {
  const { user, logout } = useUser();
  
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.userId) {
        try {
          const apiUrl = `http://localhost:3000/api/user/${user.userId}`;

          const response = await axios.get(apiUrl);
          setUserName(response.data.name); 
          console.log(response.data.name) 
        } catch (error) {
          console.error('Error fetching user information:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);



  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="logo">
        <img src={logo} alt="Logo de l'application" className="logo-image" />
        <div className="logo_div">
          <h2>L'atelier Cadeaux | Plateforme Administrateur</h2>
        </div>
      </div>
      <div className="user-profile">
        <img src={profilepic} alt="User profile" className="profile-image" />
        <div className="profile-options">
          <p>User : {user.name}</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
