import React from "react";
import Header from "../../components/Header/Header";
import Navbar from "../../components/NavBar/NavBar";
import "../../assets/images/background.png";
import "./Dashboard.css";
import Dashboards from "../../components/Dashboards/Dashboards";
import { useUser } from "../../context/userContext";

const Dashboard = () => {
  const {user} = useUser();
  console.log("User Context =", user)
  return (
    <div className="dashboard-container">
      <Header />
      <main className="main">
        <Navbar />
        <div className="content">
          <Dashboards />
          <Dashboards />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
