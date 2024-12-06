import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const apiUrl = "http://localhost:3000/auth/login";
      const response = await axios.post(apiUrl, {
        email: formData.email,
        password: formData.password,
      });
  
      localStorage.setItem("auth_token", response.data.token);
  
      const { user_id, name, email, role, address, city, zipcode, profession } =
        response.data.data; 
      login(user_id, name, email, role, address, city, zipcode, profession);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  
  

  return (
    <div className="login-container">
      <form className="login-form">
        <h2 className="login-title">Espace Administrateur</h2>
        <div className="login-input-group">
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="login-input"
            placeholder="Votre email"
          />
        </div>
        <div className="login-input-group">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="login-input"
            placeholder="Votre mot de passe"
          />
        </div>
        <button type="button" onClick={handleLogin} className="login-button">
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
