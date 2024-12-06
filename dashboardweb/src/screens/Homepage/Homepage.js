import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div>
      <h1>Welcome !</h1>
      <Link to="/login">Espace Admin</Link>
    </div>
  );
};

export default Homepage;
