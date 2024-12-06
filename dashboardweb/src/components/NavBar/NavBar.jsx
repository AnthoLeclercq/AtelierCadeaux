import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link } from "react-router-dom"; 
import "./NavBar.css";

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <nav
      className={`navbar ${isHovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ul>
        <li>
          {isHovered ? (
            <Link className="navbar_link" to="/dashboard">Accueil</Link>
          ) : (
            <Link className="navbar_link" to="/dashboard">
              <DashboardIcon />
            </Link>
          )}
        </li>
        <li>
          {isHovered ? (
            <Link className="navbar_link" to="/products">Produits</Link>
          ) : (
            <Link className="navbar_link" to="/products">
              <InventoryIcon />
            </Link>
          )}
        </li>
        <li>
          {isHovered ? (
            <Link className="navbar_link" to="/users">Utilisateurs</Link>
          ) : (
            <Link className="navbar_link" to="/users">
              <PersonIcon />
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
